import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Place } from '@/models/Place';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
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
