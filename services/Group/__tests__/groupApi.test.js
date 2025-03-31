const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const groupApi = require('../api/groupApi');
const { sequelize, User, Business } = require('models');

// Mock the token validation function
jest.mock('../domain/validation', () => ({
  validate: jest.fn(),
}));

const { validate } = require('../domain/validation');
const { NONE } = require('sequelize');

const app = express();
app.use(bodyParser.json());
groupApi(app);

beforeAll(async () => {
  await sequelize.sync({ force: true });
  //const { fullName, password, email, phone, state, city, street, streetNumber, zipCode, businessName, businessNumber, description, category, websiteLink, contactEmail } = req.body;
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
    const register2Response = await request(app)
      .post('/registerBusiness')
      .send({
        fullName: 'Jane',
        password: 'password123',
        email: 'jane@example.com',
        phone: '1234567890',
        state: 'State',
        city: 'City',
        street: 'Street',
        streetNumber: '123',
        zipCode: '12345',
        businessName: 'Jane Business',
        businessNumber: '123456',
        description: 'Business to test if category distinction works',
        category: 'bonus',
        websiteLink: 'www.example.com',
        contactEmail: 'alice@example.com'
      });
    expect(registerResponse.status).toBe(201);
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

describe('Group API', () => {
  // Test for registering a new group
  it('should create a group', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
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
    expect(response.body.message).toBe('Group created successfully');
    expect(response.body.group).toHaveProperty('id');
  });

  // Test for creating group with missing details
  it('should not create a group with missing details', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const response = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: null,
        description: 'Group to test if the system works',
        base64Image: null,
        price: 50,
        discount: 0.1,
        size: 10,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Error creating group');
    expect(response.body.error).toBe('Missing required fields');
  });

  // Test for retrieving group details
  it('should return the group with the given ID', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id

    const response = await request(app)
      .get('/get')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({id});

    expect(response.status).toBe(200);
    expect(response.group).toHaveProperty('name', 'Test Group');
  });

  // Test for retrieving group that doesn't exist
  it('should return 400 if the group ID doesn\'t exist', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });

    const response = await request(app)
      .get('/get')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({id:123});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Error fetching group');
      expect(response.body.error).toBe('Group does not exist');
  });

  // Test for saving a group
  it('should save a group for a user', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const saveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });

    expect(saveResponse.status).toBe(200);
    expect(saveResponse.body.message).toBe('Group saved successfully');
  });

  // Test for saving group that doesn't exist
  it('should not save a group that doesn\'t exist', async () => {
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const saveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: 123
      });

      expect(saveResponse.status).toBe(400);
      expect(saveResponse.body.message).toBe('Error saving group');
      expect(saveResponse.body.error).toBe('Group does not exist');
  });

  // Test for saving group for invalid user
  it(' should return 401 for invalid token when saving a group', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockRejectedValueOnce(new Error('Invalid token'));

    const saveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });
    expect(saveResponse.status).toBe(401);
    expect(saveResponse.body.message).toBe('Unauthorized');
  });

  // Test for saving the same group twice
  it('should not save the same group twice', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const saveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });

    expect(saveResponse.status).toBe(200);
    const saveResponse2 = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });
    expect(saveResponse2.status).toBe(400);
    expect(saveResponse2.body.message).toBe('Error saving group');
    expect(saveResponse2.body.error).toBe('Group already saved');
  });

  // Test for retrieving saved groups
  it('should return all saved groups for a given user', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const saveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });

    expect(saveResponse.status).toBe(200);
    const getResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.groups).toHaveLength(1);
  });
  // Test for returng correct pages of groups
  it('should only return groups depending on the limit and page', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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
      const createResponse2 = await request(app)
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

    id = createResponse.body.group.id
    id2 = createResponse2.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const saveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });
    const saveResponse2 = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id2
      });

    expect(saveResponse.status).toBe(200);
    expect(saveResponse2.status).toBe(200);
    const getResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        page: 1,
        limit: 1
      });
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.groups[0]).toHaveProperty('id',id);
    const getResponse2 = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        page: 2,
        limit: 1
      });
    expect(getResponse2.status).toBe(200);
    expect(getResponse2.body.groups[1]).toHaveProperty('id',id2);
  });
  // Test for handling out of bounds saved groups
  it('should not return groups out of bounds', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const saveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });

    expect(saveResponse.status).toBe(200);
    const getResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        page: 2,
        limit: 10
      });
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.groups).toHaveLength(0);
    const getResponse2 = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        page: 0,
        limit: 10
      });
    expect(getResponse2.status).toBe(200);
    expect(getResponse2.body.groups).toHaveLength(0);
  });
  // Test for returning groups of invalid user
  it('should not return groups for an invalid user', async () => {
    const accessToken = 'valid-token';
    validate.mockRejectedValueOnce(new Error('Invalid token'));
    const saveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });

    expect(saveResponse.status).toBe(200);
    const getResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(getResponse.status).toBe(401);
    expect(getResponse.body.message).toBe('Unauthorized');
  });
  // Test for unsaving a group
  it('should unsave a group for a user', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const saveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });

    expect(saveResponse.status).toBe(200);
    const unsaveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });
    expect(unsaveResponse.status).toBe(200);
    expect(unsaveResponse.message).toBe('Group unsaved successfully');
  });
  // Test for unsaving a group that wasn't saved
  it('should not unsave a group that wasn\'t saved', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });
    const unsaveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });
    expect(unsaveResponse.status).toBe(400);
    expect(unsaveResponse.message).toBe('Error unsaving group');
  });
  // Test for unsaving a group that doesn't exist
  it('should not unsave a group that doesn\'t exist', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });
    const unsaveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: 123
      });
    expect(unsaveResponse.status).toBe(400);
    expect(unsaveResponse.message).toBe('Error unsaving group');
  });
  // Test for unsaving a group for invalid uzer
  it('should not unsave a group for an unauthorized user', async () => {
    const accessToken = 'valid-token';
    validate.mockRejectedValueOnce(new Error('Invalid token'));
    const unsaveResponse = await request(app)
      .post('/saveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: 123
      });
    expect(unsaveResponse.status).toBe(401);
    expect(unsaveResponse.message).toBe('Unauthorized');
  });

  // Test for joining a group
  it('should join a user to a group', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const joinResponse = await request(app)
      .post('/joinGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id,
        amount: 1
      });

    expect(joinResponse.status).toBe(200);
    expect(joinResponse.body).toHaveProperty('groupId',id);
  });
  // Test for joining a group that was already joined
  it('should join a group that was already joined', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const joinResponse = await request(app)
      .post('/joinGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id,
        amount: 1
      });
      const joinResponse2 = await request(app)
      .post('/joinGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id,
        amount: 1
      });

    expect(joinResponse2.status).toBe(200);
    expect(joinResponse2.body).toHaveProperty('groupId',id);
  });
  // Test for joining a group beyond the maximum
  it('should not join a group beyond the maximum', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test Group',
        description: 'Group to test if the system works',
        base64Image: null,
        price: 50,
        discount: 0.1,
        size: 2,
      });

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const joinResponse = await request(app)
      .post('/joinGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id,
        amount: 3
      });
    expect(joinResponse.status).toBe(401);
    expect(joinResponse.body.message).toBe('Error joining group');
    expect(joinResponse.body.error).toBe('Amount exceeds group capacity');
  });
  // Test for joining a group that doesn't exist
  it('should not join a group that doesn\'t exist', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const joinResponse = await request(app)
      .post('/joinGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: 123,
        amount: 1
      });
    expect(joinResponse.status).toBe(401);
    expect(joinResponse.body.message).toBe('Error joining group');
    expect(joinResponse.body.error).toBe('Group does not exist');
  });
  // Test for joining a group for an unauthorized user
  it('should return 401 for invalid token when joining a group', async () => {
    const accessToken = 'valid-token';
    validate.mockRejectedValueOnce(new Error('Invalid token'));
    const joinResponse = await request(app)
      .post('/joinGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: 123,
        amount: 1
      });
    expect(joinResponse.status).toBe(401);
    expect(joinResponse.message).toBe('Unauthorized');
  });

  // Test for leaving a group
  it('should remove a user from a group', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const joinResponse = await request(app)
      .post('/joinGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: 123,
        amount: 1
      });

    expect(joinResponse.status).toBe(200);
    const unjoinResponse = await request(app)
      .post('/leaveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });
    expect(unjoinResponse.status).toBe(200);
    expect(unjoinResponse.message).toBe('Left group successfully');
  });
  // Test for leaving a group that wasn't joined
  it('should not unjoin a group that wasn\'t joined', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const unjoinResponse = await request(app)
      .post('/leaveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id
      });
    expect(unjoinResponse.status).toBe(400);
  });
  // Test for leaving a group that doesn't exist
  it('should not unjoin a group that doesn\'t exist', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const unjoinResponse = await request(app)
      .post('/leaveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: 123
      });
    expect(unjoinResponse.status).toBe(400);
    expect(joinResponse.body.error).toBe('Group does not exist');
  });
  // Test for unjoining a group for an unauthorized user
  it('should return 401 for invalid token when unjoining a group', async () => {
    const accessToken = 'valid-token';
    validate.mockRejectedValueOnce(new Error('Invalid token'));
    const joinResponse = await request(app)
      .post('/leaveGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: 123,
        amount: 1
      });
    expect(joinResponse.status).toBe(401);
    expect(joinResponse.message).toBe('Unauthorized');
  });
  // Test for searching by name
  it('should filter by name', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    const createResponse2 = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Another Group',
        description: 'Group to test if getname works',
        base64Image: null,
        price: 50,
        discount: 0.1,
        size: 10,
      });

    expect(createResponse2.status).toBe(201);
    id2 = createResponse2.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const getResponse = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {text: 'Test'}
      });

    expect(getResponse.status).toBe(200);
    expect(getResponse.groups[0].id).toBe(id);
    const getResponse2 = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {text: 'Another'}
      });

    expect(getResponse2.status).toBe(200);
    expect(getResponse2.groups[0].id).toBe(id2);
  });
  // Test for searching by category
  it('should filter by catetory', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'jane@example.com' });
    const createResponse2 = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Another Group',
        description: 'Group to test if getname works',
        base64Image: null,
        price: 50,
        discount: 0.1,
        size: 10,
      });

    expect(createResponse2.status).toBe(201);
    id2 = createResponse2.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const getResponse = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {category: 'Test'}
      });

    expect(getResponse.status).toBe(200);
    expect(getResponse.groups[0].id).toBe(id);
    const getResponse2 = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {category: 'Bonus'}
      });

    expect(getResponse2.status).toBe(200);
    expect(getResponse2.groups[0].id).toBe(id2);
  });
  // Test for searching by price
  it('should filter by price', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    const createResponse2 = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Another Group',
        description: 'Group to test if getname works',
        base64Image: null,
        price: 30,
        discount: 0.1,
        size: 10,
      });

    expect(createResponse2.status).toBe(201);
    id2 = createResponse2.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const getResponse = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {price: 50}
      });

    expect(getResponse.status).toBe(200);
    expect(getResponse.groups[0].id).toBe(id);
    const getResponse2 = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {price: 30}
      });

    expect(getResponse2.status).toBe(200);
    expect(getResponse2.groups[0].id).toBe(id2);
  });
  // Test for searching by multiple criteria
  it('should filter by price', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    const createResponse2 = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Another Group',
        description: 'Group to test if getname works',
        base64Image: null,
        price: 30,
        discount: 0.1,
        size: 10,
      });

    expect(createResponse2.status).toBe(201);
    id2 = createResponse2.body.group.id
    const createResponse3 = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Another',
        description: 'Group to test if the system works',
        base64Image: null,
        price: 50,
        discount: 0.1,
        size: 10,
      });

    expect(createResponse3.status).toBe(201);
    id3 = createResponse3.body.group.id3
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const getResponse = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {price: 50,text:'Another'}
      });

    expect(getResponse.status).toBe(200);
    expect(getResponse.groups[0].id).toBe(id3);
  });
  // Test for no filter
  it('should return all groups if no filters are specified', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    const createResponse2 = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Another Group',
        description: 'Group to test if getname works',
        base64Image: null,
        price: 50,
        discount: 0.1,
        size: 10,
      });

    expect(createResponse2.status).toBe(201);
    id2 = createResponse2.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const getResponse = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {}
      });

    expect(getResponse.status).toBe(200);
    expect(getResponse.groups).toHaveLength(2);
  });
  // Test for limit and range
  it('should only return groups depending on the limit and page', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    const createResponse2 = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Another Group',
        description: 'Group to test if getname works',
        base64Image: null,
        price: 50,
        discount: 0.1,
        size: 10,
      });

    expect(createResponse2.status).toBe(201);
    id2 = createResponse2.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const getResponse = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {price:50,page:1,limit:1}
      });
    expect(getResponse.status).toBe(200);
    expect(getResponse.groups[0].id).toBe(id);
    const getResponse2 = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {price:50,page:2,limit:1}
      });

    expect(getResponse2.status).toBe(200);
    expect(getResponse2.groups[0].id).toBe(id2);
  });
  // Test for return out of bounds
  it('should not return groups out of bounds', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });

    const getResponse = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {price:50,page:2,limit:10}
      });
    expect(getResponse.status).toBe(200);
    expect(getResponse.groups).toHaveLength(0);
    const getResponse2 = await request(app)
      .get('/getPage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        filters: {price:50,page:0,limit:10}
      });

    expect(getResponse2.status).toBe(200);
    expect(getResponse2.groups).toHaveLength(0);
  });
  // Test for returning business history
  it('should get the history of a business', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    const getResponse = await request(app)
    .get('/businessHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    expect(getResponse.status).toBe(200);
    expect(getResponse.groups).toHaveLength(1);
  });
  // Test for returning business history
  it('should get the history of a business per page', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    const createResponse2 = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Another Group',
        description: 'Group to test if getname works',
        base64Image: null,
        price: 50,
        discount: 0.1,
        size: 10,
      });

    expect(createResponse2.status).toBe(201);
    id2 = createResponse2.body.group.id
    const getResponse = await request(app)
    .get('/businessHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      page:1,
      limit:1
    });
    expect(getResponse.status).toBe(200);
    expect(getResponse.groups).toHaveLength(1);
    const getResponse2 = await request(app)
    .get('/businessHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      page:2,
      limit:1
    });
    expect(getResponse2.status).toBe(200);
    expect(getResponse2.groups[0].id).toBe(id2);
  });
  // Test for returning business history out of bounds
  it('should not return groups out of bounds', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    const getResponse = await request(app)
    .get('/businessHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      page:2,
      limit:10
    });
    expect(getResponse.status).toBe(200);
    expect(getResponse.groups).toHaveLength(0);
    const getResponse2 = await request(app)
    .get('/businessHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      page:0,
      limit:10
    });
    expect(getResponse2.status).toBe(200);
    expect(getResponse2.groups).toHaveLength(0);
  });
  // Test for returning groups of invalid user
  it('should return 401 for invalid token when getting business history', async () => {
    const accessToken = 'valid-token';
    validate.mockRejectedValueOnce(new Error('Invalid token'));
    const getResponse = await request(app)
    .get('/businessHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    expect(getResponse.status).toBe(401);
    expect(getResponse.body.message).toBe('Unauthorized');
  });

  // Test for returning user history
  it('should get the history of a user', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });
    const joinResponse = await request(app)
      .post('/joinGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id,
        amount: 1
      });
    const getResponse = await request(app)
    .get('/getUserHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    expect(getResponse.status).toBe(200);
    expect(getResponse.groups).toHaveLength(1);
  });
  // Test for returning business history
  it('should get the history of a business per page', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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

    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    const createResponse2 = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Another Group',
        description: 'Group to test if getname works',
        base64Image: null,
        price: 50,
        discount: 0.1,
        size: 10,
      });

    expect(createResponse2.status).toBe(201);
    id2 = createResponse2.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });
    const joinResponse = await request(app)
      .post('/joinGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id,
        amount: 1
      });
    const joinResponse2 = await request(app)
      .post('/joinGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id,
        amount: 2
      });
    const getResponse = await request(app)
    .get('/getUserHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      page:1,
      limit:1
    });
    expect(getResponse.status).toBe(200);
    expect(getResponse.groups).toHaveLength(1);
    const getResponse2 = await request(app)
    .get('/getUserHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      page:2,
      limit:1
    });
    expect(getResponse2.status).toBe(200);
    expect(getResponse2.groups[0].id).toBe(id2);
  });
  // Test for returning business history out of bounds
  it('should not return groups out of bounds', async () => {
    const accessToken = 'valid-token';
    validate.mockResolvedValueOnce({ userEmail: 'alice@example.com' });
    const createResponse = await request(app)
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
    expect(createResponse.status).toBe(201);
    id = createResponse.body.group.id
    validate.mockResolvedValueOnce({ userEmail: 'bob@example.com' });
    const joinResponse = await request(app)
      .post('/joinGroup')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        groupId: id,
        amount: 1
      });
    const getResponse = await request(app)
    .get('/getUserHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      page:2,
      limit:10
    });
    expect(getResponse.status).toBe(200);
    expect(getResponse.groups).toHaveLength(0);
    const getResponse2 = await request(app)
    .get('/getUserHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      page:0,
      limit:10
    });
    expect(getResponse2.status).toBe(200);
    expect(getResponse2.groups).toHaveLength(0);
  });
  // Test for returning groups of invalid user
  it('should return 401 for invalid token when getting business history', async () => {
    const accessToken = 'valid-token';
    validate.mockRejectedValueOnce(new Error('Invalid token'));
    const getResponse = await request(app)
    .get('/getUserHistory')
    .set('Authorization', `Bearer ${accessToken}`)
    expect(getResponse.status).toBe(401);
    expect(getResponse.body.message).toBe('Unauthorized');
  });
});