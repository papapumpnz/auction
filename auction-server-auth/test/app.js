var request = require('supertest');
var app = require('../server.js');
var token;
  
describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /health', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/health')
      .expect(200, done);
  });
});

describe('POST /api/v1/login with valid account', function() {
  it('should return 200 OK with JSON', function(done) {
    var user={email:'super@super.com',password:'Password1'};
    request(app)
      .post('/api/v1/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res) {
        token=res.body.token;
        done();
      });
  });
});

describe('POST /api/v1/login with invalid account', function() {
  it('should return 401 "Unauthorized"', function(done) {
    var user={email:'cats@cats.cats',password:'Password1'};
    request(app)
      .post('/api/v1/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(401, done);
  });
});

describe('POST /api/v1/token with valid token', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .post('/api/v1/token')
      .set('Accept', 'application/json')
      .set('Authorization' ,'JWT ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('POST /api/v1/token with invalid token', function() {
  it('should return 401 "Unauthorized"', function(done) {
    request(app)
      .post('/api/v1/token')
      .set('Accept', 'application/json')
      .set('Authorization' ,'JWT 45gfzvklKVElkfdete35343.34fkltYepdewpfsEq')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });
});

describe('GET /random-url', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});