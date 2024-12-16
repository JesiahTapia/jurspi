import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import User from '@/lib/models/User';
import Case from '@/lib/models/Case';

export const s3Mock = mockClient(S3Client);

export const setupTestDB = async () => {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  return mongod;
};

export const createTestUser = async () => {
  const password = await hash('password123', 10);
  return await User.create({
    email: 'test@example.com',
    password,
    role: 'USER'
  });
};

export const createTestDocument = async (userId: string) => {
  return {
    originalName: 'test.pdf',
    size: 1024,
    mimeType: 'application/pdf',
    key: `${userId}/test.pdf`,
    version: 1
  };
}; 