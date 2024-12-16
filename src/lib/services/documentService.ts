import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_BUCKET_NAME, FILE_SIZE_LIMIT, ALLOWED_FILE_TYPES } from '../utils/s3Config';
import { Document } from '../models/Document';
import { DocumentType } from '../models/types';
import { VirusScanService } from './virusScanService';

export class DocumentService {
  static async validateFile(file: Express.Multer.File) {
    if (file.size > FILE_SIZE_LIMIT) {
      throw new Error('File size exceeds limit');
    }
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      throw new Error('File type not allowed');
    }

    const isSafe = await VirusScanService.scanBuffer(file.buffer);
    if (!isSafe) {
      throw new Error('File failed virus scan');
    }
  }

  static async uploadToS3(file: Express.Multer.File, key: string) {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);
    return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }

  static async createDocument({
    file,
    caseId,
    uploadedBy,
    type,
    title,
    description
  }: {
    file: Express.Multer.File;
    caseId: string;
    uploadedBy: string;
    type: DocumentType;
    title: string;
    description?: string;
  }) {
    await this.validateFile(file);
    
    const key = `cases/${caseId}/${Date.now()}-${file.originalname}`;
    const fileUrl = await this.uploadToS3(file, key);

    return Document.create({
      documentId: `doc_${Date.now()}`,
      caseId,
      uploadedBy,
      type,
      title,
      description,
      fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      version: 1,
      isActive: true,
      metadata: {
        originalName: file.originalname,
        s3Key: key
      }
    });
  }

  static async createNewVersion(documentId: string, file: Express.Multer.File) {
    const doc = await Document.findOne({ documentId });
    if (!doc) throw new Error('Document not found');

    await this.validateFile(file);
    
    const key = `cases/${doc.caseId}/${Date.now()}-${file.originalname}`;
    const fileUrl = await this.uploadToS3(file, key);

    doc.version += 1;
    doc.fileUrl = fileUrl;
    doc.fileSize = file.size;
    doc.mimeType = file.mimetype;
    doc.metadata = {
      ...doc.metadata,
      originalName: file.originalname,
      s3Key: key
    };

    return doc.save();
  }

  static async softDelete(documentId: string) {
    return Document.findOneAndUpdate(
      { documentId },
      { isActive: false },
      { new: true }
    );
  }

  static async deleteFromS3(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key
    });
    await s3Client.send(command);
  }

  static async cleanupInactiveDocuments(olderThan: Date) {
    const inactiveDocuments = await Document.find({
      isActive: false,
      updatedAt: { $lt: olderThan }
    });

    for (const doc of inactiveDocuments) {
      const s3Key = doc.metadata?.s3Key;
      if (s3Key) {
        await this.deleteFromS3(s3Key);
      }
      await Document.deleteOne({ _id: doc._id });
    }
  }
} 