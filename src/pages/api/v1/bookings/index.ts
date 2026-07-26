import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const session = (await getServerSession(req, res, authOptions)) as Session | null;

  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const query: Record<string, unknown> = {};
      if (session.user.role === 'student') {
        query.student = session.user.id;
      }

      const bookings = await Booking.find(query).populate('hostel');
      return res.status(200).json({ success: true, data: bookings });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ success: false, message });
    }
  }

  if (req.method === 'POST') {
    try {
      if (session.user.role !== 'student') {
        return res.status(403).json({ success: false, message: 'Only students can book visits' });
      }

      const { hostelId, visitDate } = req.body;

      const newBooking = await Booking.create({
        hostel: hostelId,
        student: session.user.id,
        visitDate,
        status: 'requested'
      });

      return res.status(201).json({ success: true, data: newBooking });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ success: false, message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
