import mongoose from 'mongoose';

export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
} 