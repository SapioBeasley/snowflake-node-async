import { Connection, createConnection, Statement } from "snowflake-sdk";

interface ConnectionConfig {
  account: string;
  username: string;
  password: string
}

/**
 * Service to interact with tables within snowflake. Snowflake does not function async by default, so this is an attempt
 * to make that happen
 *
 * Step 1: Instanciate the service with your credentials
 *
 * `const snowflakeService = new SnowflakeService({ account, username, password })`
 */
export class SnowflakeService {
  private readonly connectionConfig: ConnectionConfig
  connection: Connection

  constructor(connectionConfig: ConnectionConfig) {
    this.connectionConfig = connectionConfig
    this.connection = createConnection(this.connectionConfig);
  }

  /**
   * Step 2: Connect to the service. After instantiating this service with your credentials, you are ready to connect.
   *
   * `await snowflakeService.connectAsync()`
   */
  connectAsync = () => new Promise((resolve, reject): void => {
    this.connection.connect((err, conn) => {
      if (err) reject(err.message)
      resolve(conn)
    })
  });

  /**
   * Finally you can make requests to your databases. In this implementation, bindings are required. Bingings are passed
   * as an array. SqlText represents the query you are requesting data of.
   *
   * const BINDING1 = 'someValueToSearchBy'
   * const BINDING2 = 'anotherOne'
   *
   * enum Queries {
   *   SOME_QUERY = `SELECT * FROM someTable WHERE id = ? and somethingElse = ?`
   * }
   *
   * const {stmt, results} = await snowflakeService.executeAsync({
   *  bindings: [BINDING1, BINDING2],
   *  sqlText: Queries.SOME_QUERY
   * })
   *
   * @param bindings string[] Data you would like to include in your query.
   * @param sqlText  string   SQL query using '?' to apply bindings.
   */
  executeAsync = ({bindings, sqlText}: { bindings: string[]; sqlText: string }): Promise<{ stmt: Statement, results: any[] }> =>
    new Promise((resolve, reject) => {
      this.connection.execute({
        binds: bindings,
        sqlText: sqlText,
        complete(err: Error, stmt: Statement, rows: any[] | undefined): void {
          if (err) reject(err.message)
          const results = rows || []

          resolve({stmt, results})
        }
      })
    })
}
