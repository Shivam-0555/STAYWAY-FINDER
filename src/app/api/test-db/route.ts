import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Place } from '@/models/Place';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/staywayfinder';
    
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI, { dbName: 'staywayfinder' });
    }
    
    const count = await Place.countDocuments();
    const dbName = mongoose.connection.db?.databaseName;
    const collections = await mongoose.connection.db?.listCollections().toArray();
    
    return NextResponse.json({
      status: 'ok',
      uri_exists: !!process.env.MONGODB_URI,
      dbName,
      count,
      collections: collections?.map(c => c.name)
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
