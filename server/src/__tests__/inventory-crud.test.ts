import request from 'supertest';
import { app } from '../index';
import mongoose from 'mongoose';

const TEST_USER = {
  name: 'Inventory Test User',
  email: 'inventoryuser@example.com',
  password: 'Password123',
};

let testUserToken = '';
let createdId: string = '';

const validInventoryData = {
  name: 'Test Item',
  sku: 'SKU123',
  category: 'Electronics',
  price: 99.99,
  stock: 10,
  reorderPoint: 2,
  lastRestocked: new Date().toISOString(),
  status: 'in-stock',
};

describe('Inventory API CRUD', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!, {});
    }
  });

  beforeEach(async () => {
    // Register and login a fresh user for each test to ensure valid JWT
    try {
      await request(app).post('/api/auth/register').send(TEST_USER);
    } catch (e) {}
    const loginRes = await request(app).post('/api/auth/login').send({
      email: TEST_USER.email,
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
      .post('/api/inventory')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({ sku: 'SKU123' }); // missing required fields
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should create an inventory item with valid data', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send(validInventoryData);
    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();
    createdId = res.body._id;
  });

  it('should update an inventory item', async () => {
    // First create an item
    const createRes = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send(validInventoryData);
    const id = createRes.body._id;
    const res = await request(app)
      .put(`/api/inventory/${id}`)
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({ name: 'Updated Item' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Item');
  });

  it('should get an inventory item by id', async () => {
    // First create an item
    const createRes = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send(validInventoryData);
    const id = createRes.body._id;
    const res = await request(app)
      .get(`/api/inventory/${id}`)
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(id);
  });

  it('should return 404 for missing inventory item', async () => {
    const res = await request(app)
      .get('/api/inventory/000000000000000000000000')
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(res.statusCode).toBe(404);
  });

  it('should delete an inventory item', async () => {
    // First create an item
    const createRes = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send(validInventoryData);
    const id = createRes.body._id;
    const res = await request(app)
      .delete(`/api/inventory/${id}`)
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .get('/api/inventory');
    expect(res.statusCode).toBe(401);
  });
});
