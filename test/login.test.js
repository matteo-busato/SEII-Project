const app = require("../index.js");
const fetch = require("node-fetch");
const mongoose = require('mongoose');

const url = "http://localhost:8080"


describe('test POST to /api/v1/users/auth', () => {

    let server;
    let connection;

  beforeAll( async ()  => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect('mongodb://localhost:27017/SEII',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

    //## 1 ##
    it('The field email must be a non-empty string', async () => {
      expect.assertions(1);
      var response = await fetch(url + '/api/v1/users/auth', {
          method: 'POST',
          body: JSON.stringify({
              email: "",
              password: "asd123"
          }),
          headers: {
          'Content-Type': 'application/json',
          }
      });
      var json = await response.json();
      expect(response.status).toEqual(404);
  });

    //## 2 ##
    it('The field password must be a non-empty string', async () => {
      expect.assertions(1);
      var response = await fetch(url + '/api/v1/users/auth', {
          method: 'POST',
          body: JSON.stringify({
              email: "testemail@test.com",
              password: ""
         }),
          headers: {
          'Content-Type': 'application/json',
          }
      });
      var json = await response.json();
      expect(response.status).toEqual(401);
  });

});
