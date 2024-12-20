import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { hash } from 'bcryptjs';
import User from '@/lib/models/User';
import Case from '@/lib/models/Case';
import Document from '@/lib/models/Document';

let mongod: MongoMemoryServer;

export const setupTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
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

export const createTestCase = async (userId: string) => {
  const caseData = {
    caseNumber: 'ARB-2024-001',
    status: 'FILED',
    claimant: {
      type: 'CLAIMANT',
      name: 'John Doe',
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    },
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
  };

  return await Case.create(caseData);
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