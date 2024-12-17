import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  try {
    const conn = await connectToDatabase();
    
    if (conn.readyState === 1) {
      res.status(200).json({
        status: 'connected',
        database: conn.name
      });
    } else {
      throw new Error('Database not connected');
    }
  } catch (error) {
    console.log('error: Health check failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Database connection failed'
    });
  }
} 