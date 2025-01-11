import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'localhost',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '1025'),
  secure: false,
  auth: process.env.EMAIL_SERVER_USER ? {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  } : undefined
});

export type EmailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export const sendEmail = async ({ to, subject, text, html }: EmailParams) => {
  if (process.env.NODE_ENV === 'test') {
    return Promise.resolve({ messageId: 'test-id' });
  }

  if (!to) {
    throw new Error('Recipient email is required');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    to,
    subject,
    text,
    html
  };

  return await transporter.sendMail(mailOptions);
}; 