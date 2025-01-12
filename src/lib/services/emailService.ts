import nodemailer from 'nodemailer';

export type EmailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export const sendEmail = async ({ to, subject, text, html }: EmailParams) => {
  // Validate required parameters first
  if (!to) {
    console.error('Email service received undefined "to" parameter');
    throw new Error('Recipient email is required');
  }

  // In test environment, just return
  if (process.env.NODE_ENV === 'test') {
    return Promise.resolve({ messageId: 'test-id' });
  }

  // In development, just log
  if (process.env.NODE_ENV === 'development') {
    console.log('Development Mode - Email would be sent:', {
      to,
      subject,
      text,
      html
    });
    return Promise.resolve({ messageId: 'dev-mode' });
  }

  // For production, use actual email sending
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html
  };

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD
    }
  });

  return await transporter.sendMail(mailOptions);
};