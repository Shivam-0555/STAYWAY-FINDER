import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Place } from "@/models/Place";
import mongoose from "mongoose";

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { placeId, ...updateData } = body;

    if (!placeId || !mongoose.Types.ObjectId.isValid(placeId)) {
      return NextResponse.json({ error: "Invalid Place ID" }, { status: 400 });
    }

    // Set lastUpdated
    updateData.lastUpdated = new Date();

    const updatedPlace = await Place.findByIdAndUpdate(
      placeId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedPlace) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, place: updatedPlace });
  } catch (error) {
    console.error("Error updating place:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
