import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { VisitRequest } from "@/models/VisitRequest";
import { Place } from "@/models/Place";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const { hostelId, studentName, phone, email, date, time, message } = body;
    
    if (!hostelId || !studentName || !phone || !email || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const place = await Place.findById(hostelId);
    if (!place) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    // Prevent duplicate requests
    const existing = await VisitRequest.findOne({ hostelId, email, date, time, status: "Pending" });
    if (existing) {
      return NextResponse.json({ error: "You already have a pending request for this time" }, { status: 400 });
    }

    // Generate unique Pass ID
    const passId = `VP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const newRequest = await VisitRequest.create({
      hostelId,
      hostelName: place.name,
      studentName,
      phone,
      email,
      date,
      time,
      message,
      passId,
      ownerId: place.owner || undefined,
    });

    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    console.error("Error creating visit request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const requests = await VisitRequest.find({ email }).sort({ createdAt: -1 });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching visit requests:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
