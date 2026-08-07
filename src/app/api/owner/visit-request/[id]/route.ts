import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { VisitRequest } from "@/models/VisitRequest";
import mongoose from "mongoose";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Request ID" }, { status: 400 });
    }

    const body = await request.json();
    const { status, date, time, message } = body;

    const validStatuses = ["Pending", "Accepted", "Rejected", "Rescheduled", "Completed", "Checked In"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    let updateData: any = { status };

    if (status === "Rescheduled") {
      if (!date || !time) return NextResponse.json({ error: "Date and time required for reschedule" }, { status: 400 });
      updateData.date = date;
      updateData.time = time;
      if (message) updateData.message = message;
    }

    if (status === "Checked In") {
      updateData.checkInTime = new Date();
    }
    
    if (status === "Completed") {
      updateData.completedTime = new Date();
    }

    const updated = await VisitRequest.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("Error updating visit request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
