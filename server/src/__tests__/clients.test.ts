import request from 'supertest';
import { app } from '../index';
import mongoose from 'mongoose';

describe('GET /api/clients', () => {
  beforeAll(async () => {
    // Ensure test DB is connected before running tests
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!, {});
    }
  });

  afterAll(async () => {
    // Clean up: drop the test DB and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).get('/api/clients');
    expect(res.statusCode).toBe(401);
  });
});
