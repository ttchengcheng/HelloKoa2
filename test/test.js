const app = require('../app');
const request = require('supertest').agent(app.listen());

describe('http get', () => {
  describe('when GET /', () => {
    it('should show main page',
       (done) => { request.get('/').expect(200, done); });
  });

  describe('when GET /upload', () => {
    it('should show upload page',
       (done) => { request.get('/upload').expect(200, done); });
  });

  describe('when GET /404', () => {
    it('should show 404 page',
       (done) => { request.get('/404').expect(200, done); });
  });

  describe('when GET /users', () => {
    it('should show users page',
       (done) => { request.get('/users').expect(200, done); });
  });

  describe('when GET /users', () => {
    it('should show users bar page',
       (done) => { request.get('/users/bar').expect(200, done); });
  });

  describe('when GET /user', () => {
    it('should be a non-exist page',
       (done) => { request.get('/user').expect(302, done); });
  });

});