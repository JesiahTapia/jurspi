import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI!;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!mongoose.connection.readyState) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    await cached.promise;
    cached.conn = mongoose.connection;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
} 