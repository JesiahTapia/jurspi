import mongoose from 'mongoose';

export async function connectToDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    return conn;
  } catch (error) {
    if (error instanceof Error && 
        error.message.includes('Invalid connection string')) {
      throw new Error('Invalid MongoDB connection string format');
    }
    throw error;
  }
} 