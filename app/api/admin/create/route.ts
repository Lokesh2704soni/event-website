import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("khatu_mandir");

    const existingAdmin = await db.collection("admins").findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin already exists",
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.collection("admins").insertOne({
      email: email.toLowerCase(),
      passwordHash,
      role: "admin",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully 🙏",
    });
  } catch (error) {
    console.error("Create admin error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}