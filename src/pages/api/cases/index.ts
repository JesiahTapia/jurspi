import { NextApiRequest, NextApiResponse } from 'next';
import { Case } from '@/lib/models/Case';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'POST':
        const newCase = new Case({
          ...req.body,
          claimantId: req.user.id,
          status: 'PENDING'
        });
        const savedCase = await newCase.save();
        return res.status(201).json(savedCase);

      case 'GET':
        const cases = await Case.find({
          $or: [
            { claimantId: req.user.id },
            { respondentId: req.user.id },
            { arbitratorId: req.user.id }
          ]
        });
        return res.status(200).json(cases);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
} 