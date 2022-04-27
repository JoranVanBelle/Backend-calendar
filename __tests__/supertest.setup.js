const supertest = require('supertest');
const createServer = require('../src/createServer');
const {  getKnex } = require('../src/data');

const withServer = (setter) => {
  let server;

  beforeAll(async () => {
    server = await createServer();
    setter({
      request: supertest(server.getApp().callback()),
      knex: getKnex(),
    });
  });

  afterAll(async () => {
    await server.stop();
  });
};

const login = async (supertest) => {
  const response = await supertest.post('/api/users/login')
    .send({
      email: 'test.user@calendar.be',
      password: '12345678',
    });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || 'Unknown error occured');
  }

  return `Bearer ${response.body.token}`;
};

const loginAdmin = async (supertest) => {
  const response = await supertest.post('/api/user/login')
    .send({
      email: 'admin.user@calendar.be',
      password: '12345678',
    });

  if (response.statusCode !== 200) {
    throw new Error(response.body.message || 'Unknown error occured');
  }

  return `Bearer ${response.body.token}`;
};

module.exports = {
  login,
  loginAdmin,
  withServer,
};