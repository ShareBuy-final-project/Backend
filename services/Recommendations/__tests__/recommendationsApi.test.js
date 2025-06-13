const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const recommendationsApi = require('../api/recommendationsApi');
const { sequelize } = require('models');

const app = express();
app.use(bodyParser.json());
recommendationsApi(app);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Recommendations API', () => {
  it('should return 501 for unimplemented endpoint', async () => {
    const response = await request(app).get('/recommendations');
    expect(response.status).toBe(501);
    expect(response.body.message).toBe('Not implemented');
  });
});