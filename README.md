CUSTOMER TICKET SYSTEM

The APIs is structured in to 3 parts for each role involved in accessing the system. i.e. support agent, admin. user

Documentation explains more about this API find it here:
https://documenter.getpostman.com/view/3707157/T1Ds8b45


I assumed all users who want to submit tickets should be logged into the sytem. JWT takes care of authentication while user session is handle by express-session.

Test  - Jest and Supertest.

To run this locally after cloning from github,

1. run npm install

2. npm run devStart 

3. Create a '.env' file that will contain TOKEN_SECRET=[anyValueYouwant]
[anyValueYouwant] above will be replaced by a reasonable length of string you wish to use (at leat a string of length 7-10).

To run the tests,

run npm test