import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import User from '@/lib/models/User';
import { Case } from '@/models/Case';

export const s3Mock = mockClient(S3Client);
let mongod: MongoMemoryServer;
let counter = 0;

export const setupTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
};

export const closeTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
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

export async function createTestCase(userId: string) {
  const case_ = await Case.create({
    userId,
    caseNumber: `ARB-${Date.now()}`,
    status: 'FILED',
    claimant: userId,
    dispute: {
      description: 'Contract breach',
      amount: 50000,
      category: 'CONTRACT'
    },
    contract: {
      title: 'Service Agreement',
      fileUrl: 'https://example.com/contract.pdf',
      clauses: [{ number: 1, text: 'Service terms' }]
    },
    claimDetails: {
      description: 'Failed to deliver services',
      amount: 50000,
      breachedClauses: [1],
      supportingEvidence: []
    }
  });
  return case_;
}

export const createTestDocument = async (userId: string) => {
  return {
    originalName: 'test.pdf',
    size: 1024,
    mimeType: 'application/pdf',
    key: `${userId}/test.pdf`,
    version: 1
  };
}; 