import nodemailer from 'nodemailer';

export interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const createTransporter = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  console.log('Creating email transporter in', isDevelopment ? 'development' : 'production', 'mode');
  
  const config = {
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    debug: isDevelopment
  };

  console.log('Email config:', {
    ...config,
    auth: { user: config.auth.user, pass: '****' }
  });

  return nodemailer.createTransport(config);
};

export async function sendEmail({ to, subject, text, html }: EmailParams) {
  if (!to) {
    console.error('Missing recipient email');
    throw new Error('Recipient email is required');
  }

  const transporter = createTransporter();
  const isDevelopment = process.env.NODE_ENV === 'development';

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: isDevelopment ? `[DEV] ${subject}` : subject,
      text,
      html,
    });
    
    if (isDevelopment) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}