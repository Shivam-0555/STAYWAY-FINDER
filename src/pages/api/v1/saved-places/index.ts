import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import SavedPlace from '@/models/SavedPlace';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const session = (await getServerSession(req, res, authOptions)) as Session | null;

  if (!session || session.user.role !== 'student') {
    return res.status(401).json({ success: false, message: 'Unauthorized or not a student' });
  }

  if (req.method === 'GET') {
    try {
      const savedPlaces = await SavedPlace.find({ student: session.user.id }).populate('hostel');
      return res.status(200).json({ success: true, data: savedPlaces });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ success: false, message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { hostelId } = req.body;
      const existing = await SavedPlace.findOne({ student: session.user.id, hostel: hostelId });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Already saved' });
      }

      const newSavedPlace = await SavedPlace.create({
        student: session.user.id,
        hostel: hostelId
      });
      return res.status(201).json({ success: true, data: newSavedPlace });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ success: false, message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
