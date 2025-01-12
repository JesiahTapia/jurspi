import { sendEmail } from '@/lib/services/emailService';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('Email Service', () => {
  beforeEach(() => {
    (nodemailer.createTransport as jest.Mock).mockClear();
  });

  it('should send email successfully', async () => {
    const mockSendMail = jest.fn().mockResolvedValue({ messageId: '123' });
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail
    });

    await sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      text: 'Test email'
    });

    expect(mockSendMail).toHaveBeenCalled();
  });

  it('should handle email sending errors', async () => {
    const mockSendMail = jest.fn().mockRejectedValue(new Error('SMTP error'));
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail
    });

    await expect(sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      text: 'Test email'
    })).rejects.toThrow('SMTP error');
  });
}); 