import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import User from '@/lib/models/User';
import Case from '@/lib/models/Case';
import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { Types } from 'mongoose';

export const s3Mock = mockClient(S3Client);

let counter = 0;
let mongod: MongoMemoryServer;

export const setupTestDB = async () => {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongod.getUri());
    }
  }
  return mongod;
};

export const closeTestDB = async () => {
  if (mongod) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
    mongod = null;
  }
};

export const clearTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
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
    filingDate: new Date(),
    claimant: {
      type: 'CLAIMANT',
      name: 'Test User',
      email: 'test@example.com',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country'
      }
    },
    dispute: {
      description: 'Test dispute',
      amount: 1000,
      category: 'CONTRACT'
    },
    contract: {
      title: 'Test Contract',
      fileUrl: 'https://example.com/contract.pdf',
      clauses: [{ number: 1, text: 'Test clause' }]
    },
    claimDetails: {
      description: 'Test claim',
      amount: 1000,
      breachedClauses: [1],
      supportingEvidence: []
    },
    respondentAnswer: { counterClaims: [] },
    arbitrators: [],
    documents: [],
    timeline: []
  });
  return case_;
} 