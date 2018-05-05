NodeJs Rest API
===================
#### An example of a rest api in NodeJs without any framework.

## Instructions
1. Install with `yarn install`
2. Start server with `yarn start`


- Run tests with `yarn test`

## Endpoints
|METHOD    |URI                           |INPUT                         |OUTPUT
|----------|------------------------------|------------------------------|----------------------------
|PUT       |/api/user                     |{username, email, password}   | Success message or errors
|GET       |/api/user?q=query             |query string                  | List with found users or errors
|PUT       |/api/message                  |{message, sender, receiever}  | Success message or errors
|GET       |/api/message/userId/sent      |                              | List of messages sent by user or errors
|GET       |/api/message/userId/received  |                              | List of messages received by user or errors



## Structure

##### Code
Code is found in the `src/` folder and tests are placed in folders named with `_tests_`.

- `controllers/` - Controllers for endpoints
- `models/` - Models for input validation 
- `utils/`
  - `config.js` - Config and constants
  - `database.js` - Write and read from files
  - `functions.js` - Re-used functions
  - `router.js` - Register and handle http requests
- `index.js` - Where server gets started

##### Other
- `dist/` - Built code (get built when running `yarn start`)
- `db/` - "Database files" (created if not exists when running `yarn start` throw the `create-db-files.js` script)
- `coverage/` - Code coverage

#### External dependencies
- Encrypt passwords with `bcrypt-nodejs`
