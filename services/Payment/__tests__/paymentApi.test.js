const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userApi = require('../api/paymentApi');
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
  const registerResponse = await request(app)
        .post('/registerBusiness')
        .send({
          fullName: 'Alice',
          password: 'password123',
          email: 'alice@example.com',
          phone: '1234567890',
          state: 'State',
          city: 'City',
          street: 'Street',
          streetNumber: '123',
          zipCode: '12345',
          businessName: 'Test Business',
          businessNumber: '123456',
          description: 'Business to test if the system works',
          category: 'test',
          websiteLink: 'www.example.com',
          contactEmail: 'alice@example.com'
        });
      expect(registerResponse.status).toBe(201);
  const response = await request(app)
        .post('/create')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Group',
          description: 'Group to test if the system works',
          base64Image: null,
          price: 50,
          discount: 0.1,
          size: 10,
        });
        expect(response.status).toBe(201);
        id = response.body.group.id
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

describe('Payment API', () => {
  // Test for creating a payment intent
  it('should create a payment intent', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });
    const response = await request(app)
      .post('/paymentIntent')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id,
        amount: 1
      });

    expect(response.status).toBe(201);
  });

  // Test for not creating payment for a group that doesn't exist
  it('should not create a payment intent for an invalid group', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });
    const response = await request(app)
      .post('/paymentIntent')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: 12345,
        amount: 1
      });


    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Error making payment');
    expect(response.body.error).toBe('Group Not Found');
  });

  // Test for not creating payment without valid token
  it('should not create a payment intent for an invalid token', async () => {
    const accessToken = 'valid-token';
    validate.mockRejectedValueOnce(new Error('Invalid token'));
    const response = await request(app)
      .post('/paymentIntent')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: 12345,
        amount: 1
      });


    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Error making payment');
    expect(response.body.error).toBe('Error creating payment intent');
  });

  // Test for creating a connected account
  it('should create a connected account', async () => {
    const response = await request(app)
      .post('/create-connected-account')
      .send('alice@example.com');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  // Test for creating account link
  it('should create an account link', async () => {
    const response = await request(app)
      .post('/create-connected-account')
      .send('alice@example.com');

    expect(response.status).toBe(201);
    paymentId = response.body.id
    const linkResponse = await request(app)
      .post('/create-connected-account')
      .send(paymentId);

    expect(linkResponse.status).toBe(201);
    expect(response.body).toHaveProperty('url');
  });

  // Test for account onboarding success
  it('should redirect account onboarding success', async () => {
    const response = await request(app)
      .post('/account-onboarding-success')

    expect(response.redirect).toBe('exp://10.100.102.6:8081');
  });

});