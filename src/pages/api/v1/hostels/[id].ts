import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Hostel from '@/models/Hostel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const hostel = await Hostel.findById(id).populate('owner', 'name email avatarUrl').populate('city');
      if (!hostel) {
        return res.status(404).json({ success: false, message: 'Hostel not found' });
      }
      return res.status(200).json({ success: true, data: hostel });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Add PUT and DELETE methods later as needed with authentication
  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
