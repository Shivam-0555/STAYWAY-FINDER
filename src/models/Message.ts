import { Schema, model, models, Document } from 'mongoose';

export type MessageCategory = 'hostel' | 'food' | 'hospital' | 'emergency' | 'atm' | 'transport' | 'bug report' | 'suggestion' | 'general inquiry' | 'contact';
export type MessagePriority = 'high' | 'medium' | 'low';
export type MessageStatus = 'new' | 'read' | 'replied';

export interface IMessageReply {
  sender: 'user' | 'admin';
  message: string;
  createdAt: Date;
  attachmentPath?: string;
}

export interface IMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  category: MessageCategory;
  priority: MessagePriority;
  status: MessageStatus;
  attachmentPath?: string;
  replies: IMessageReply[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['hostel', 'food', 'hospital', 'emergency', 'atm', 'transport', 'bug report', 'suggestion', 'general inquiry', 'contact'],
      default: 'general inquiry',
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
    attachmentPath: { type: String },
    replies: [
      {
        sender: { type: String, enum: ['user', 'admin'], required: true },
        message: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
        attachmentPath: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure we don't reuse a stale compiled model without the latest enum values.
// If an existing compiled model is present but its `category` enum does not
// include the current values (e.g. 'contact'), remove it so we can re-register
// the model with the up-to-date schema. This prevents runtime validation
// errors caused by stale Mongoose models when using hot-reloading or cached
// server bundles.
if (models.Message) {
  try {
    type ExistingModel = { schema?: { paths?: { category?: { enumValues?: string[] } } } };
    const existing = models.Message as unknown as ExistingModel;
    const enumValues: string[] | undefined = existing?.schema?.paths?.category?.enumValues;
    if (!Array.isArray(enumValues) || !enumValues.includes('contact')) {
      // delete stale model so we can register the fresh schema below
      delete (models as Record<string, unknown>)['Message'];
    }
  } catch {
    // ignore and proceed to register the model
  }
}

export default models.Message || model<IMessage>('Message', MessageSchema);