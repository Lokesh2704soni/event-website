import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";

// =========================
// CHECK ADMIN
// =========================

async function checkAdmin() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("admin_session")?.value;

  if (!token) {
    return false;
  }

  const session = await verifySession(token);

  return !!(
    session &&
    session.role === "admin"
  );
}


// =========================
// GET CONTENT
// =========================

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("khatu_mandir");

    const content = await db
      .collection("website_content")
      .find({})
      .toArray();

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error(
      "Get website content error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load website content",
      },
      { status: 500 }
    );
  }
}


// =========================
// CREATE / UPDATE CONTENT
// =========================

export async function PUT(
  request: Request
) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      section,
      title,
      subtitle,
      description,
      phone,
      email,
      address,
      mapUrl,
    } = body;

    if (!section) {
      return NextResponse.json(
        {
          success: false,
          message: "Section is required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("khatu_mandir");

    const existingContent =
      await db
        .collection("website_content")
        .findOne({
          section,
        });

    const contentData = {
      section,
      title: title || "",
      subtitle: subtitle || "",
      description: description || "",
      phone: phone || "",
      email: email || "",
      address: address || "",
      mapUrl: mapUrl || "",
      updatedAt: new Date(),
    };

    if (existingContent) {
      await db
        .collection("website_content")
        .updateOne(
          {
            _id: existingContent._id,
          },
          {
            $set: contentData,
          }
        );
    } else {
      await db
        .collection("website_content")
        .insertOne({
          ...contentData,
          createdAt: new Date(),
        });
    }

    return NextResponse.json({
      success: true,
      message:
        "Website content updated successfully 🙏",
    });
  } catch (error) {
    console.error(
      "Update website content error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update website content",
      },
      { status: 500 }
    );
  }
}