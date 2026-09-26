import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and message are required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("khatu_mandir");

    await db.collection("messages").insertOne({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      read: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully 🙏",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 500 }
    );
  }
}