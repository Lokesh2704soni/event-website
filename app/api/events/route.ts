import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("khatu_mandir");

    const events = await db
      .collection("events")
      .find({})
      .sort({ year: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Public events error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load events",
      },
      { status: 500 }
    );
  }
}