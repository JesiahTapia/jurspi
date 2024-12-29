import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import User from '@/lib/models/User';
import Case from '@/lib/models/Case';
import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';

export const s3Mock = mockClient(S3Client);

let counter = 0;

export const setupTestDB = async () => {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  return mongod;
};

export const closeTestDB = async () => {
  await mongoose.disconnect();
};

export const clearTestDB = async () => {
  await mongoose.connection.dropDatabase();
};

export const createTestUser = async () => {
  const password = await hash('password123', 10);
  counter++;
  return await User.create({
    email: `test${counter}@example.com`,
    password,
    role: 'USER'
  });
};

export const createTestCase = async (userId: string) => {
  return await Case.create({
    claimant: userId,
    status: 'FILED'
  });
}; 