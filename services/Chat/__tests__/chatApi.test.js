const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userApi = require('../api/chatApi');
const { sequelize, User, Business } = require('models');

// Mock the token validation function
jest.mock('../domain/validation', () => ({
  validate: jest.fn(),
}));

const { validate } = require('../domain/validation');

const app = express();
app.use(bodyParser.json());
var id = 0;
userApi(app);

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const registerUserResponse = await request(app)
          .post('/register')
          .send({
            fullName: 'Bob',
            password: 'password123',
            email: 'bob@example.com',
            phone: '1234567890',
            state: 'State',
            city: 'City',
            street: 'Street',
            streetNumber: '123',
            zipCode: '12345'
          });
    
        expect(registerUserResponse.status).toBe(201);
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  // Test logging it
  it('should login', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'bob@example.com',
        password: 'password123',
        isBusiness: false
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  // Test for logging in with invalid password
  it('should not log in with invalid password', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'bob@example.com',
        password: 'muhahahaha',
        isBusiness: false
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toHaveProperty('Error logging in');
    expect(response.body.error).toHaveProperty('Invalid credentials');
  });

  // Test for logging in with invalid email
  it('should not log in with invalid email', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'elon@example.com',
        password: 'password123',
        isBusiness: false
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toHaveProperty('Error logging in');
    expect(response.body.error).toHaveProperty('Invalid credentials');
  });

  // Test for logging out
  it('should lougout', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'bob@example.com',
        password: 'password123',
        isBusiness: false
      });

    expect(response.status).toBe(201);
    token = response.body.accessToken;
    const logoutResponse = await request(app)
    .delete('/logout')
    .send({
      token: token
    });

  expect(logoutResponse.status).toBe(201);
  });

  // Test for logging out with invalid token
  it('should not log out with an invalid token', async () => {
    validate.mockRejectedValueOnce(new Error('Invalid token'));
    const response = await request(app)
      .delete('/logout')
      .send({
        token: 'Bearer invalid-token'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toHaveProperty('Error logging out');
  });

  // Test for validating token
  it('should vallidate a token', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({
        email: 'bob@example.com',
        password: 'password123',
        isBusiness: false
      });

    expect(loginResponse.status).toBe(201);
    token = loginResponse.body.accessToken;
    const response = await request(app)
    .get('/validate-token')
    .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
  });
  // Test for validating an invalid token
  it('should not vallidate an invald token', async () => {
    validate.mockRejectedValueOnce(new Error('Invalid token'));
    token = loginResponse.body.token;
    const response = await request(app)
    .get('/validate-token')
    .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body.valid).toBe(false);
  });

  // Test for refreshing token
  it('should refresh a token', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({
        email: 'bob@example.com',
        password: 'password123',
        isBusiness: false
      });

    expect(loginResponse.status).toBe(201);
    token = loginResponse.body.refreshToken;
    const response = await request(app)
    .post('/refresh-token')
    .send({
      refreshToken: token
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken')
  });
   // Test for refreshing an invalid token
   it('should not refresh an invald token', async () => {
    validate.mockRejectedValueOnce(new Error('Invalid token'));
    token = loginResponse.body.token;
    const response = await request(app)
    .get('/validate-token')
    .send({
      refreshToken: 'Bearer invalid-token'
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Error refreshing token');
  });
});