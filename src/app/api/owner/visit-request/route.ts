import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { VisitRequest } from "@/models/VisitRequest";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    // In a real app we'd filter by logged-in owner's ID
    const requests = await VisitRequest.find().sort({ createdAt: -1 });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching owner visit requests:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
