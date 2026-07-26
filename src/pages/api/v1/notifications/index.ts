import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const session = (await getServerSession(req, res, authOptions)) as Session | null;

  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const notifications = await Notification.find({ user: session.user.id }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: notifications });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ success: false, message });
    }
  }

  if (req.method === 'PATCH') {
    try {
      await Notification.updateMany({ user: session.user.id, read: false }, { read: true });
      return res.status(200).json({ success: true, message: 'Notifications marked as read' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ success: false, message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
