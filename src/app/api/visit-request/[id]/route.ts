import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { VisitRequest } from "@/models/VisitRequest";
import mongoose from "mongoose";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    // id could be _id or passId
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { passId: id };
    }

    const visitRequest = await VisitRequest.findOne(query);

    if (!visitRequest) {
      return NextResponse.json({ error: "Visit Request not found" }, { status: 404 });
    }

    return NextResponse.json(visitRequest);
  } catch (error) {
    console.error("Error fetching visit request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
