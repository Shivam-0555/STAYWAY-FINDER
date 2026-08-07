import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Place } from "@/models/Place";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const message = body.message || "";

    if (!message.trim()) {
      return NextResponse.json({ reply: "Please provide a message.", places: [] });
    }

    // Basic search based on words in the message (to narrow down the DB before passing to AI)
    // In a real app we'd use vector search or more advanced filters.
    const words = message.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
    
    let filter: any = {};
    if (words.length > 0) {
      filter.$or = words.flatMap((w: string) => [
        { name: { $regex: w, $options: "i" } },
        { address: { $regex: w, $options: "i" } },
        { city: { $regex: w, $options: "i" } },
        { category: { $regex: w, $options: "i" } },
        { description: { $regex: w, $options: "i" } }
      ]);
    }

    const places = await Place.find(filter).limit(10).lean();

    const formattedPlaces = places.map((p: any) => {
      const { _id, ...rest } = p;
      return {
        ...rest,
        _id: _id.toString(),
        id: _id.toString(),
      };
    });

    let reply = "I couldn't process this right now.";

    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
You are StayWay AI, a strict assistant for StayWay Finder.
The user is asking: "${message}"

Here is the exact data from our verified MongoDB database:
${JSON.stringify(formattedPlaces, null, 2)}

Strict Instructions:
1. You MUST answer the user's question using ONLY the provided database context.
2. NEVER invent, guess, or hallucinate information. If the specific detail is not present in the context, you must not assume it.
3. If the user wants to BOOK A VISIT or SCHEDULE A VISIT:
   - Identify the hostel from the context.
   - If you have a hostel, date (e.g. tomorrow, monday), and time, output ONLY a JSON object in this exact format:
     {"intent": "book_visit", "hostelId": "...", "hostelName": "...", "date": "YYYY-MM-DD", "time": "HH:MM", "studentName": "Guest", "phone": "0000000000", "email": "guest@example.com"}
   - If they didn't specify which hostel, or didn't provide a date/time, politely ask them for the missing information. Do NOT output JSON yet.
4. For all other queries, answer normally in plain text.
5. If the context is empty or does not contain the answer, reply exactly with: "I don't have verified information for this."
`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const aiText = response.text || "I don't have verified information for this.";

      try {
        if (aiText.trim().startsWith("{") && aiText.trim().endsWith("}")) {
          const intentData = JSON.parse(aiText);
          if (intentData.intent === "book_visit") {
            // Call our internal logic
            const { VisitRequest } = await import("@/models/VisitRequest");
            const crypto = await import("crypto");
            const passId = `VP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
            
            await VisitRequest.create({
              hostelId: intentData.hostelId,
              hostelName: intentData.hostelName,
              studentName: intentData.studentName,
              phone: intentData.phone,
              email: intentData.email,
              date: intentData.date,
              time: intentData.time,
              passId,
              status: "Pending"
            });
            reply = "Your visit request has been submitted successfully.";
          }
        } else {
          reply = aiText;
        }
      } catch (e) {
        reply = aiText;
      }

    } else {
       reply = "AI is not configured yet (missing GEMINI_API_KEY). But I found " + formattedPlaces.length + " places matching your query.";
    }

    return NextResponse.json({
      reply,
      places: formattedPlaces
    });
  } catch (error) {
    console.error("Error in /api/ai/chat:", error);
    return NextResponse.json({ reply: "Sorry, I'm having trouble processing your request right now.", places: [] }, { status: 500 });
  }
}
