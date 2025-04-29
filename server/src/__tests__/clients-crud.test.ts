import request from 'supertest';
import { app } from '../index';
import mongoose from 'mongoose';

const TEST_USER = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'Password123',
};

let testUserToken = '';

let createdId: string = '';

beforeEach(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {});
  }
  // Use a unique email for each test run
  const uniqueEmail = `testuser+${Date.now()}@example.com`;
  await request(app).post('/api/auth/register').send({
    ...TEST_USER,
    email: uniqueEmail,
  });
  const loginRes = await request(app).post('/api/auth/login').send({
    email: uniqueEmail,
    password: TEST_USER.password,
  });
  testUserToken = loginRes.body?.data?.token || '';
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

it('should reject creation with invalid data', async () => {
  const res = await request(app)
    .post('/api/clients')
    .set('Authorization', `Bearer ${testUserToken}`)
    .send({ email: 'not-an-email' });
  expect(res.statusCode).toBe(400);
  expect(res.body.errors).toBeDefined();
});

it('should create a client with valid data', async () => {
  const res = await request(app)
    .post('/api/clients')
    .set('Authorization', `Bearer ${testUserToken}`)
    .send({ name: 'Test Client', email: 'test@client.com', phone: '12345678' });
  expect(res.statusCode).toBe(201);
  expect(res.body._id).toBeDefined();
  createdId = res.body._id;
});

it('should update a client', async () => {
  const res = await request(app)
    .put(`/api/clients/${createdId}`)
    .set('Authorization', `Bearer ${testUserToken}`)
    .send({ name: 'Updated Client' });
  expect(res.statusCode).toBe(200);
  expect(res.body.name).toBe('Updated Client');
});

it('should get a client by id', async () => {
  const res = await request(app)
    .get(`/api/clients/${createdId}`)
    .set('Authorization', `Bearer ${testUserToken}`);
  expect(res.statusCode).toBe(200);
  expect(res.body._id).toBe(createdId);
});

it('should return 404 for missing client', async () => {
  const res = await request(app)
    .get('/api/clients/000000000000000000000000')
    .set('Authorization', `Bearer ${testUserToken}`);
  expect(res.statusCode).toBe(404);
});

it('should delete a client', async () => {
  const listRes = await request(app)
    .get('/api/clients')
    .set('Authorization', `Bearer ${testUserToken}`);
  const res = await request(app)
    .delete(`/api/clients/${createdId}`)
    .set('Authorization', `Bearer ${testUserToken}`);
  expect(res.statusCode).toBe(200);
});

it('should return 401 if not authenticated', async () => {
  const res = await request(app)
    .get('/api/clients');
  expect(res.statusCode).toBe(401);
});
