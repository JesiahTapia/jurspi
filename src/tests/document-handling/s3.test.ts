import { generateUploadUrl, deleteFile } from '@/lib/s3';
import { s3Mock, setupTestDB } from './setup';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

describe('S3 Integration', () => {
  beforeEach(() => {
    s3Mock.reset();
  });

  it('should generate upload URL', async () => {
    const url = await generateUploadUrl('test-key', 'application/pdf');
    expect(url).toBeTruthy();
    expect(s3Mock.calls()).toHaveLength(1);
    expect(s3Mock.calls()[0].args[0].constructor).toBe(PutObjectCommand);
  });

  it('should delete file from S3', async () => {
    await deleteFile('test-key');
    expect(s3Mock.calls()).toHaveLength(1);
    expect(s3Mock.calls()[0].args[0].constructor).toBe(DeleteObjectCommand);
  });
}); 