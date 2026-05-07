import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow frontend origin in production
app.use(cors({
  origin: '*', // Allow all origins for the prototype
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'AI Receptionist API is running', env: process.env.NODE_ENV });
});

// Database connection
const connectDB = async () => {
  // Use env var if available, otherwise fallback to the hardcoded Atlas URI
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://agenticservices007_db_user:HSKgNPrRCayB6jNS@aireceptionistsaasproto.yyudgf9.mongodb.net/ai-receptionist?retryWrites=true&w=majority&appName=AIReceptionistSaaSPrototype';

  if (!mongoUri) {
    // Dev-only fallback: spin up an in-memory MongoDB
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL: MONGODB_URI is not set in production. Exiting.');
      process.exit(1);
    }
    console.log('No MONGODB_URI found. Starting in-memory MongoDB server (dev only)...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    console.log('Connected to in-memory MongoDB.');
    return;
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB Atlas.');
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
