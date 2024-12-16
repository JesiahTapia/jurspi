import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import logger from '@/lib/utils/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const conn = await connectToDatabase();
    const stats = await conn.connection.db.stats();
    
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mongodb: {
        status: conn.connection.readyState === 1 ? 'connected' : 'disconnected',
        version: conn.version,
        connections: {
          current: stats.connections,
          available: stats.connections,
          active: stats.activeClients
        },
        latency: await measureLatency(conn)
      }
    };

    logger.info('Health check performed', healthCheck);
    return res.status(200).json(healthCheck);
  } catch (error) {
    logger.error('Health check failed:', error);
    return res.status(500).json({
      status: 'unhealthy',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}

async function measureLatency(conn: any): Promise<number> {
  const start = Date.now();
  await conn.connection.db.command({ ping: 1 });
  return Date.now() - start;
} 