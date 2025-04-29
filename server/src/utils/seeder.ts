import mongoose from 'mongoose';
import { User } from '../models/User';
import connectDB from '../config/database';

const createTestUser = async () => {
  try {
    await connectDB();
    console.log('Connected to database for seeding');

    // Check if test user exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test123456',
    });

    console.log('Test user created successfully:', user.email);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeder
createTestUser();
