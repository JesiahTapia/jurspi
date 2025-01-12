import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import { sendEmail } from '@/lib/services/emailService';
import { generateResetToken } from '@/lib/utils/auth';
import { validateEmail } from '@/lib/utils/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = generateResetToken();
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      text: `Your password reset token is: ${resetToken}`
    });

    return res.status(200).json({ message: 'Reset email sent' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 