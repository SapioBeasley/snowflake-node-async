# snowflake-node-async
Just making snowflake sdk async

import { Connection, createConnection, Statement } from "snowflake-sdk";

ConnectionConfig [Learn More]('https://docs.snowflake.com/en/user-guide/nodejs-driver-use.html#required-connection-options')
|   |   |   |   |   |
|---|---|---|---|---|
|account: string Account name plus region used to log in.   |   |   |   |   |
|username: string well .. username   |   |   |   |   |
|   |   |   |   |   |
  -  
  -   - password: string and of course .. password

Service to interact with tables within snowflake. Snowflake does not function async by default, so this is an attempt to make that happen

## Usage
Instanciate the service with your credentials
`const snowflakeService = new SnowflakeService({ account, username, password })`

After instantiating this service with your credentials, you are ready to connect.
`await snowflakeService.connectAsync()`

Finally you can make requests to your databases. In this implementation, bindings are required. Bingings are passed as an array. SqlText represents the query you are requesting data of.
```
const BINDING1 = 'someValueToSearchBy'
const BINDING2 = 'anotherOne'

enum Queries {
  SOME_QUERY = `SELECT * FROM someTable WHERE id = ? and somethingElse = ?`
}

const {stmt, results} = await snowflakeService.executeAsync({
  bindings: [BINDING1, BINDING2],
  sqlText: Queries.SOME_QUERY
})
