import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import User from '@/lib/models/User';
import { Case } from '@/models/Case';
import { Document } from '@/lib/models/Document';

export const s3Mock = mockClient(S3Client);

let mongoServer: MongoMemoryServer;

export async function setupMongoDb() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}

export async function teardownMongoDb() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}

export async function clearMongoDb() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

export async function createTestUser() {
  const hashedPassword = await hash('password123', 10);
  return User.create({
    email: `test${Date.now()}@example.com`,
    password: hashedPassword,
    name: 'Test User'
  });
}

export async function createTestCase(userId: string) {
  return Case.create({
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

export async function createTestDocument(caseId: string, userId: string) {
  return Document.create({
    title: 'Test Document',
    type: 'EVIDENCE',
    fileUrl: 'https://example.com/test.pdf',
    uploadedBy: userId,
    caseId: caseId,
    documentId: new mongoose.Types.ObjectId().toString(),
    metadata: {
      size: 1024,
      mimeType: 'application/pdf'
    }
  });
} 