var request = require('supertest');
var app = require('../server.js');
var tokenRefresh;
var tokenAuth;

//this is root level hook  with setTimeout to wait for application initialization
before(function (done) { console.log("App initialization complete"); this.timeout(15000); setTimeout(done, 10000); });

describe('auction-server-auth', function () {

  describe('GET /', function () {
    it('should return 200 OK', function (done) {
      request(app)
          .get('/')
          .expect(200, done);
    });
  });

  describe('GET /health', function () {
    it('should return 200 OK', function (done) {
      request(app)
          .get('/health')
          .expect(200, done);
    });
  });

  /*
   *  Login
   */

  describe('POST /api/v1/login with valid account', function () {
    it('should return 200 OK with JSON', function (done) {
      var user = {email: 'super@super.com', password: 'Password1'};
      request(app)
          .post('/api/v1/login')
          .set('Accept', 'application/json')
          .send(user)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              console.error(res.error);
            }
            tokenRefresh = res.body.token;
            done();
          });
    });
  });

  describe('POST /api/v1/login with invalid account', function () {
    it('should return 401 "Unauthorized"', function (done) {
      var user = {email: 'cats@cats.cats', password: 'Password1'};
      request(app)
          .post('/api/v1/login')
          .set('Accept', 'application/json')
          .send(user)
          .expect('Content-Type', /json/)
          .expect(401, done)
          .end(function (err, res) {
            if (err) {
              console.error(res.error);
            }
            done();
          });
    });
  });


  /*
   *  Token
   */

  describe('POST /api/v1/token with valid refreshToken', function () {
    it('should return 200 OK with JSON', function (done) {
      request(app)
          .post('/api/v1/token')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + tokenRefresh)
          .expect('Content-Type', /json/)
          .expect(200, done)
          .end(function (err, res) {
            if (err) {
              console.error(res.error);
            }
            tokenAuth = res.body.token;
            done();
          });
    });
  });

  describe('POST /api/v1/token with an expired refreshToken', function () {
    it('should return 401 "Unauthorized"', function (done) {
      request(app)
          .post('/api/v1/token')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhdXRoIiwiZXhwIjoxNDY0OTU0NzIyLCJpYXQiOjE0NjMyMjY3MjIsInN1YiI6IjU3MjFjNTQzMWY2OTU2ZjQwOGRhMTBhNCIsInR5cGUiOiJyZWZyZXNoIiwicnRpIjoiZVNjQ2dxakJob1VrRFQ0c2Zhb3d6dVlXIiwiaXAiOiI6OjEifQ.Dm-YJQhtl3ke7RjpqGBcTe1MWsHaJ_IBC69Rh4LZH4g')
          .send(user)
          .expect('Content-Type', /json/)
          .expect(401, done)
          .end(function (err, res) {
            if (err) {
              console.error(res.error);
            }
            done();
          });
    });
  });

  describe('POST /api/v1/token with an invalid refreshToken', function () {
    it('should return 401 "Unauthorized"', function (done) {
      request(app)
          .post('/api/v1/token')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer 0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhdXRoIiwiZXhwIjoxNDY0OTU0NzIyLCJpYXQiOjE0NjMyMjY3MjIsInN1YiI6IjU3MjFjNTQzMWY2OTU2ZjQwOGRhMTBhNCIsInR5cGUiOiJyZWZyZXNoIiwicnRpIjoiZVNjQ2dxakJob1VrRFQ0c2Zhb3d6dVlXIiwiaXAiOiI6OjEifQ.Dm-YJQhtl3ke7RjpqGBcTe1MWsHaJ_IBC69Rh4LZH4g')
          .send(user)
          .expect('Content-Type', /json/)
          .expect(401, done)
          .end(function (err, res) {
            if (err) {
              console.error(res.error);
            }
            done();
          });
    });
  });

  /*
   *  validatetoken
   */

  describe('POST /api/v1/validatetoken with valid authToken', function () {
    it('should return 200 OK with JSON', function (done) {
      request(app)
          .post('/api/v1/validatetoken')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + tokenAuth)
          .expect('Content-Type', /json/)
          .expect(200, done)
          .end(function (err, res) {
            if (err) {
              console.error(res.error);
            }
            tokenAuth = res.body.token;
            done();
          });
    });
  });

  describe('POST /api/v1/validatetoken with an expired authToken', function () {
    it('should return 401 "Unauthorized"', function (done) {
      request(app)
          .post('/api/v1/validatetoken')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhdXRoIiwiZXhwIjoxNDYzMTg4MTM2LCJpYXQiOjE0NjMxODgwNzYsInN1YiI6IjU3MjFjNTQzMWY2OTU2ZjQwOGRhMTBhNCIsInR5cGUiOiJyZWZyZXNoIiwicnRpIjoiNU1MOWp0bnRUOWdSUExEOFdUU2h4Q2V3IiwiaXAiOiI6OjEifQ.aUGXgpF-bqoMtB_8W_LSi_uRVmXfE-hCpWEoAK2eUBw')
          .send(user)
          .expect('Content-Type', /json/)
          .expect(401, done)
          .end(function (err, res) {
            if (err) {
              console.error(res.error);
            }
            done();
          });
    });
  });

  describe('POST /api/v1/validatetoken with an invalid authToken', function () {
    it('should return 401 "Unauthorized"', function (done) {
      request(app)
          .post('/api/v1/validatetoken')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhdXRoIiwiZXhwIjoxNDYzMTg4MTM2LCJpYXQiOjE0NjMxODgwNzYsInN1YiI6IjU3MjFjNTQzMWY2OTU2ZjQwOGRhMTBhNCIsInR5cGUiOiJyZWZyZXNoIiwicnRpIjoiNU1MOWp0bnRUOWdSUExEOFdUU2h4Q2V3IiwiaXAiOiI6OjEifQ.aUGXgpF-bqoMtB_8W_LSi_uRVmXfE-hCpWEoAK2eUBw')
          .send(user)
          .expect('Content-Type', /json/)
          .expect(401, done)
          .end(function (err, res) {
            if (err) {
              console.error(res.error);
            }
            done();
          });
    });
  });


  describe('GET /random-url', function () {
    it('should return 404', function (done) {
      request(app)
          .get('/reset')
          .expect(404, done);
    });
  });
});