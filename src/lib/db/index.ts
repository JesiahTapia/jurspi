import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: null | typeof mongoose;
    promise: null | Promise<typeof mongoose>;
  };
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    if (!global.mongoose.promise) {
      const opts = {
        bufferCommands: false,
      };
      global.mongoose.promise = mongoose.connect(process.env.MONGODB_URI, opts);
    }

    await global.mongoose.promise;
    global.mongoose.conn = mongoose;
    return mongoose.connection;
  } catch (error) {
    global.mongoose.promise = null;
    global.mongoose.conn = null;
    throw error;
  }
}

export async function disconnectFromDatabase() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } finally {
    global.mongoose = { conn: null, promise: null };
  }
} 