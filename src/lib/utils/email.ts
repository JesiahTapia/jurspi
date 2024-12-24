type EmailParams = {
  to: string;
  subject: string;
  text: string;
};

export const sendEmail = async ({ to, subject, text }: EmailParams) => {
  if (process.env.NODE_ENV === 'test') {
    return Promise.resolve();
  }
  
  // In production, implement actual email sending logic
  // For now, just console.log in development
  console.log(`Email would be sent to ${to}:`, { subject, text });
}; 