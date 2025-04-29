/**
 * MongoDB connection manager
 * Handles:
 * - Initial connection
 * - Error handling
 * - Reconnection logic
 */
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      autoIndex: true,
      maxPoolSize: 10, // Optimal for most applications
      socketTimeoutMS: 45000, // 45s timeout
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};
