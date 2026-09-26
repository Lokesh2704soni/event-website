import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    await client.db("khatu_mandir").command({
      ping: 1,
    });

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully! 🙏",
    });
  } catch (error) {
    console.error("FULL MONGODB ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}