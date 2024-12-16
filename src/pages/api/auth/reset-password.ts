import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { User } from '@/lib/models/User';
import { sendResetEmail } from '@/lib/services/emailService';
import crypto from 'crypto';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Request password reset
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      await User.updateOne(
        { _id: user._id },
        { 
          resetToken,
          resetTokenExpiry: tokenExpiry
        }
      );

      await sendResetEmail(email, resetToken);
    }

    return res.status(200).json({ 
      message: 'If an account exists, a reset email has been sent' 
    });
  }

  if (req.method === 'PATCH') {
    // Reset password
    const { token, password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await hash(password, 12);
    await User.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    );

    return res.status(200).json({ message: 'Password updated successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

export default handler; 