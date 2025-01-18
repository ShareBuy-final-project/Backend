const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userApi = require('../api/userApi');
const { sequelize, User, Business } = require('models');

// Mock the token validation function
jest.mock('../domain/validation', () => ({
  validate: jest.fn(),
}));

const { validate } = require('../domain/validation');

const app = express();
app.use(bodyParser.json());
userApi(app);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User API', () => {
  // Test for registering a new user
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        fullName: 'John Doe',
        password: 'password123',
        email: 'john.doe@example.com',
        phone: '1234567890',
        state: 'State',
        city: 'City',
        street: 'Street',
        streetNumber: '123',
        zipCode: '12345'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.user).toHaveProperty('id');
  });

  // Test for handling registration with an existing email
  it('should not register a user with an existing email', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        fullName: 'Jane Doe',
        password: 'password123',
        email: 'john.doe@example.com', // Same email as previous test
        phone: '0987654321',
        state: 'State',
        city: 'City',
        street: 'Another Street',
        streetNumber: '456',
        zipCode: '54321'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Error registering user');
    expect(response.body.error).toBe('User with this email already exists');
  });

  // Test for retrieving user details
  it('should get user details', async () => {
    const registerResponse = await request(app)
      .post('/register')
      .send({
        fullName: 'Alice',
        password: 'password123',
        email: 'alice@example.com',
        phone: '1234567890',
        state: 'State',
        city: 'City',
        street: 'Street',
        streetNumber: '123',
        zipCode: '12345'
      });

    expect(registerResponse.status).toBe(201);
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });

    const response = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'alice@example.com');
  });

  // Test for updating user details
  it('should update user details', async () => {
    const registerResponse = await request(app)
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

    expect(registerResponse.status).toBe(201);
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const updateResponse = await request(app)
      .post('/update')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        fullName: 'Bob Updated',
        email: 'bob.updated@example.com',
        phone: '0987654321',
        state: 'New State',
        city: 'New City',
        street: 'New Street',
        streetNumber: '456',
        zipCode: '54321'
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toBe('Update successful');
  });

  // Test for changing user password
  it('should change user password', async () => {
    const registerResponse = await request(app)
      .post('/register')
      .send({
        fullName: 'Charlie',
        password: 'password123',
        email: 'charlie@example.com',
        phone: '1234567890',
        state: 'State',
        city: 'City',
        street: 'Street',
        streetNumber: '123',
        zipCode: '12345'
      });

    expect(registerResponse.status).toBe(201);
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'charlie@example.com' });

    const changePasswordResponse = await request(app)
      .post('/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentPassword: 'password123',
        newPassword: 'newpassword123'
      });

    expect(changePasswordResponse.status).toBe(200);
    expect(changePasswordResponse.body.message).toBe('Password change successful');
  });

  // Test for invalid token when getting user details
  it('should return 401 for invalid token when getting user details', async () => {
    validate.mockRejectedValueOnce(new Error('Invalid token'));

    const response = await request(app)
      .get('/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token');
  });

  // Test for invalid token when updating user details
  it('should return 401 for invalid token when updating user details', async () => {
    validate.mockRejectedValueOnce(new Error('Invalid token'));

    const response = await request(app)
      .post('/update')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        fullName: 'Invalid User',
        email: 'invalid@example.com',
        phone: '0000000000',
        state: 'Invalid State',
        city: 'Invalid City',
        street: 'Invalid Street',
        streetNumber: '000',
        zipCode: '00000'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token');
  });

  // Test for invalid token when changing user password
  it('should return 401 for invalid token when changing user password', async () => {
    validate.mockRejectedValueOnce(new Error('Invalid token'));

    const response = await request(app)
      .post('/change-password')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        currentPassword: 'password123',
        newPassword: 'newpassword123'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token');
  });
});