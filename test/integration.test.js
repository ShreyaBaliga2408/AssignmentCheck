
const chai = require('chai');
const { expect , use } = chai;
const chaiHttp = require('chai-http');
const server = require('../src/index'); // Importing the Express app

use(chaiHttp);

describe('Integration Test: /healthz Endpoint', () => {
  it('should return HTTP 200 OK when the database connection is successful', (done) => {
    chai
      .request(server) // Use the Express app directly
      .get('/healthz')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.empty; // No response body
        done();
      });
  });
  it('should return HTTP 503  when the database connection is unsuccessful', (done) => {
    chai
      .request(server) // Use the Express app directly
      .get('/healthz')
      .end((err, res) => {
        expect(res).to.have.status(503);
        expect(res.body).to.be.empty; // No response body
        done();
      });
  });
});
