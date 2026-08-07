import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/mongodb';
import Message from '@/models/Message';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

function saveAttachment(base64Value: string, originalName: string) {
  if (!base64Value) {
    return undefined;
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'messages');
  fs.mkdirSync(uploadDir, { recursive: true });

  const cleanName = (originalName || 'attachment').replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${cleanName}`;
  const fullPath = path.join(uploadDir, fileName);
  const [, payload] = base64Value.split(',');
  const buffer = Buffer.from(payload || base64Value, 'base64');

  fs.writeFileSync(fullPath, buffer);
  return `/uploads/messages/${fileName}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleRequest(req, res);
}

async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const { name, email, phone, subject, message, category, priority, attachment, attachmentName } = req.body || {};

      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
      }

      const attachmentPath = saveAttachment(attachment, attachmentName || 'attachment');
      const newMessage = await Message.create({
        name,
        email,
        phone,
        subject,
        message,
        category: category || 'general inquiry',
        priority: priority || 'medium',
        attachmentPath,
        replies: [{ sender: 'user', message, createdAt: new Date(), attachmentPath }],
      });

      return res.status(201).json({ success: true, data: newMessage });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ success: false, message });
    }
  }

  if (req.method === 'GET') {
    try {
      const session = (await getServerSession(req, res, authOptions)) as Session | null;
      if (!session?.user?.email) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const userRole = (session.user as { role?: string }).role;
      if (userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const messages = await Message.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: messages });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ success: false, message });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const session = (await getServerSession(req, res, authOptions)) as Session | null;
      if (!session?.user?.email) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const userRole = (session.user as { role?: string }).role;
      if (userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const { id, status, replyMessage, replyAttachment } = req.body || {};
      if (!id) {
        return res.status(400).json({ success: false, message: 'Message id is required.' });
      }

      const messageToUpdate = await Message.findById(id);
      if (!messageToUpdate) {
        return res.status(404).json({ success: false, message: 'Message not found.' });
      }

      const nextStatus = status || (replyMessage ? 'replied' : 'read');
        if (replyMessage && replyMessage.trim()) {
          const attachmentPath = replyAttachment ? saveAttachment(replyAttachment, 'admin-reply-attachment') : undefined;
          messageToUpdate.replies.push({
            sender: 'admin',
            message: replyMessage.trim(),
            createdAt: new Date(),
            attachmentPath,
          });

          const recipient = await User.findOne({ email: messageToUpdate.email.toLowerCase() });
          if (recipient) {
            await Notification.create({
              user: recipient._id,
              type: 'message_reply',
              message: `The admin replied to your message: ${replyMessage.trim()}`,
              read: false,
            });
          }
        }

      messageToUpdate.status = nextStatus;
      await messageToUpdate.save();

      return res.status(200).json({ success: true, data: messageToUpdate });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ success: false, message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const session = (await getServerSession(req, res, authOptions)) as Session | null;
      if (!session?.user?.email) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const userRole = (session.user as { role?: string }).role;
      if (userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'Message id is required.' });
      }

      const deletedMessage = await Message.findByIdAndDelete(id);
      if (!deletedMessage) {
        return res.status(404).json({ success: false, message: 'Message not found.' });
      }

      return res.status(200).json({ success: true, message: 'Message deleted.' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ success: false, message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
