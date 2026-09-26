import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return false;
  }

  const session = await verifySession(token);

  return !!(session && session.role === "admin");
}


/* =========================================
   GET EVENTS
   Public admin API request
========================================= */

export async function GET() {
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

    const client = await clientPromise;
    const db = client.db("khatu_mandir");

    const events = await db
      .collection("events")
      .find({})
      .sort({
        year: -1,
        createdAt: -1,
      })
      .toArray();

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events",
      },
      { status: 500 }
    );
  }
}


/* =========================================
   CREATE EVENT
========================================= */

export async function POST(request: Request) {
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
      year,
      title,
      description,
      date,
    } = body;

    if (!year || !title) {
      return NextResponse.json(
        {
          success: false,
          message: "Year and event title are required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("khatu_mandir");

    const event = {
      year: Number(year),
      title: title.trim(),
      description: description?.trim() || "",
      date: date || "",
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("events")
      .insertOne(event);

    return NextResponse.json({
      success: true,
      message: "Event added successfully 🙏",
      event: {
        _id: result.insertedId,
        ...event,
      },
    });
  } catch (error) {
    console.error("Create event error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create event",
      },
      { status: 500 }
    );
  }
}


/* =========================================
   UPDATE EVENT
========================================= */

export async function PUT(request: Request) {
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
      id,
      year,
      title,
      description,
      date,
    } = body;

    if (!id || !year || !title) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Event ID, year and title are required",
        },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid event ID",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("khatu_mandir");

    const result = await db
      .collection("events")
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            year: Number(year),
            title: title.trim(),
            description:
              description?.trim() || "",
            date: date || "",
            updatedAt: new Date(),
          },
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Event updated successfully 🙏",
    });
  } catch (error) {
    console.error("Update event error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update event",
      },
      { status: 500 }
    );
  }
}


/* =========================================
   DELETE EVENT
========================================= */

export async function DELETE(request: Request) {
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

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Event ID is required",
        },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid event ID",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("khatu_mandir");

    const result = await db
      .collection("events")
      .deleteOne({
        _id: new ObjectId(id),
      });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Event deleted successfully 🙏",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete event",
      },
      { status: 500 }
    );
  }
}