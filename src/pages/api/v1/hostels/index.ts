import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Hostel from '@/models/Hostel';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const hostels = await Hostel.find({ status: 'approved' }).populate('city').limit(20);
      return res.status(200).json({ success: true, data: hostels });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user?.role !== 'owner') {
        return res.status(403).json({ success: false, message: 'Forbidden: Only owners can create hostels' });
      }

      // Basic validation should be added here
      const newHostel = await Hostel.create({
        ...req.body,
        owner: session.user.id,
        status: 'pending'
      });

      return res.status(201).json({ success: true, data: newHostel });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
