import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import clientRoutes from './routes/clientRoutes';
import saleRoutes from './routes/saleRoutes';
import expenseRoutes from './routes/expenseRoutes';
import reportRoutes from './routes/reportRoutes';
import { errorHandler } from './middleware/errorHandler';
import { globalLimiter, authLimiter, apiLimiter } from './middleware/rateLimiter';
import helmet from 'helmet';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:53304'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.use(globalLimiter);

// Routes with rate limits
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', apiLimiter, taskRoutes);
app.use('/api/inventory', apiLimiter, inventoryRoutes);
app.use('/api/clients', apiLimiter, clientRoutes);
app.use('/api/sales', apiLimiter, saleRoutes);
app.use('/api/expenses', apiLimiter, expenseRoutes);
app.use('/api/reports', apiLimiter, reportRoutes);

// Add a root endpoint to serve a friendly message or a basic HTML page
app.get('/', (req, res) => {
  res.status(200).send('<h2>ManageMate API is running!<br>See <a href="/api">/api</a> for endpoints.</h2>');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use(errorHandler);

import { connectDB } from './config/database';

// Export app for testing
export { app };

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
    });

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      process.exit(1);
    });

  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

startServer();
