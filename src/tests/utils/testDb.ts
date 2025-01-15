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

export async function setupTestDb() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);
}

export async function teardownTestDb() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
}

export async function clearTestDb() {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}

export async function createTestUser() {
  const password = await hash('password123', 10);
  counter++;
  return await User.create({
    email: `test${counter}@example.com`,
    password,
    role: 'USER'
  });
}

export async function createTestCase(userId: string) {
  return await Case.create({
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
} 