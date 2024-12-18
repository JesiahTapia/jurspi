import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import User from '@/lib/models/User';
import Case from '@/lib/models/Case';
import Document from '@/lib/models/Document';

let mongod: MongoMemoryServer;

export const setupTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
};

export const closeTestDB = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export const createTestUser = async () => {
  const password = await hash('password123', 10);
  return await User.create({
    email: 'test@example.com',
    password,
    role: 'USER'
  });
};

export const createTestCase = async (claimantId: string) => {
  return await Case.create({
    claimant: claimantId,
    status: 'PENDING_INITIAL_EVALUATION',
    contract: {
      title: 'Test Contract',
      fileUrl: 'https://example.com/contract.pdf',
      clauses: [{ number: 1, text: 'Test clause' }]
    },
    claimDetails: {
      description: 'Test claim',
      amount: 1000,
      breachedClauses: [1],
      supportingEvidence: ['https://example.com/evidence.pdf']
    }
  });
};

export const createTestDocument = async (caseId: string, uploaderId: string) => {
  return await Document.create({
    title: 'Test Document',
    type: 'EVIDENCE',
    fileUrl: 'https://example.com/test.pdf',
    uploadedBy: uploaderId,
    caseId: caseId,
    metadata: {
      size: 1024,
      mimeType: 'application/pdf'
    }
  });
}; 