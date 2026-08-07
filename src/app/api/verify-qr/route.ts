import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { VisitRequest } from "@/models/VisitRequest";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { passId } = body;

    if (!passId) {
      return NextResponse.json({ error: "Pass ID required" }, { status: 400 });
    }

    const visit = await VisitRequest.findOne({ passId });

    if (!visit) {
      return NextResponse.json({ valid: false, error: "Visit pass not found" }, { status: 404 });
    }

    // Check expiry
    const visitDate = new Date(visit.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expired = visitDate < today;

    if (expired) {
      return NextResponse.json({ valid: false, error: "Visit pass has expired", visit });
    }

    if (visit.status === "Accepted") {
      // Auto check-in
      visit.status = "Checked In";
      visit.checkInTime = new Date();
      await visit.save();
      return NextResponse.json({ valid: true, checkedIn: true, visit });
    }

    if (visit.status === "Checked In") {
      return NextResponse.json({ valid: true, checkedIn: false, message: "Already checked in", visit });
    }

    return NextResponse.json({ valid: false, error: `Cannot verify. Status: ${visit.status}`, visit });
  } catch (error) {
    console.error("Error verifying QR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
