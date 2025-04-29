import request from 'supertest';
import { app } from '../index';
import mongoose from 'mongoose';

type ExpenseStatus = 'pending' | 'approved' | 'reimbursed';

const TEST_USER = {
  name: 'Expense Test User',
  email: 'expensetestuser@example.com',
  password: 'Password123',
};

let testUserToken = '';

const validExpenseData = {
  expense_number: `EXP-${Date.now()}`,
  vendor: 'Vendor A',
  date: new Date().toISOString(),
  category: 'Office Supplies',
  amount: 150.75,
  notes: 'Test expense',
  status: 'pending' as ExpenseStatus,
};

describe('Expenses API CRUD', () => {
  beforeAll(async () => {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!, {});
      }
      await mongoose.connection.db!.collection('users').deleteMany({});
      await mongoose.connection.db!.collection('expenses').deleteMany({});

      // Register and login new user
      const uniqueEmail = `expensetestuser+${Date.now()}@example.com`;
      await request(app).post('/api/auth/register').send({
        ...TEST_USER,
        email: uniqueEmail,
      });
      const loginRes = await request(app).post('/api/auth/login').send({
        email: uniqueEmail,
        password: TEST_USER.password,
      });
      testUserToken = loginRes.body?.data?.token || '';
    } catch (err) {
      console.error('beforeAll error:', err);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!, {});
    }
    await mongoose.connection.db!.collection('expenses').deleteMany({});
  });

  it('should reject creation with invalid data', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({ vendor: 'Vendor A' }); // missing required fields
    expect(res.statusCode).toBe(400);
    expect(res.body.errors || res.body.message).toBeDefined();
  });

  it('should create an expense with valid data', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({ ...validExpenseData, expense_number: `EXP-${Date.now()}-CREATE` });
    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBeDefined();
  });

  it('should update an expense', async () => {
    // Create expense first
    const createRes = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({ ...validExpenseData, expense_number: `EXP-${Date.now()}-UPD` });
    const id = createRes.body._id;

    const res = await request(app)
      .put(`/api/expenses/${id}`)
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({ vendor: 'Vendor B' });
    expect(res.statusCode).toBe(200);
    expect(res.body.vendor).toBe('Vendor B');
  });

  it('should get all expenses', async () => {
    await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({ ...validExpenseData, expense_number: `EXP-${Date.now()}-ALL` });

    const res = await request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get an expense by id', async () => {
    const createRes = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({ ...validExpenseData, expense_number: `EXP-${Date.now()}-GET` });
    const id = createRes.body._id;

    const res = await request(app)
      .get(`/api/expenses/${id}`)
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(id);
  });

  it('should return 404 for missing expense', async () => {
    const res = await request(app)
      .get('/api/expenses/000000000000000000000000')
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(res.statusCode).toBe(404);
  });

  it('should delete an expense', async () => {
    const createRes = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({ ...validExpenseData, expense_number: `EXP-${Date.now()}-DEL` });
    const id = createRes.body._id;

    const res = await request(app)
      .delete(`/api/expenses/${id}`)
      .set('Authorization', `Bearer ${testUserToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .get('/api/expenses');
    expect(res.statusCode).toBe(401);
  });
});
