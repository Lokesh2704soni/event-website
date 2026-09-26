import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";

import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
    try {
        // =========================
        // CHECK ADMIN LOGIN
        // =========================

        const cookieStore = await cookies();
        const token = cookieStore.get("admin_session")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const session = await verifySession(token);

        if (!session || session.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        // =========================
        // GET DATA
        // =========================

        const body = await request.json();

        const { eventId, publicId } = body;

        if (!eventId || !publicId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event ID and image public ID are required",
                },
                { status: 400 }
            );
        }

        if (!ObjectId.isValid(eventId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid event ID",
                },
                { status: 400 }
            );
        }

        // =========================
        // MONGODB
        // =========================

        const client = await clientPromise;
        const db = client.db("khatu_mandir");

        const event = await db.collection("events").findOne({
            _id: new ObjectId(eventId),
        });

        if (!event) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event not found",
                },
                { status: 404 }
            );
        }

        // Check whether image belongs to this event
        const imageExists = event.images?.some(
            (image: { publicId: string }) =>
                image.publicId === publicId
        );

        if (!imageExists) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Image not found in this event",
                },
                { status: 404 }
            );
        }

        // =========================
        // DELETE FROM CLOUDINARY
        // =========================

        const cloudinaryResult =
            await cloudinary.uploader.destroy(publicId);

        if (
            cloudinaryResult.result !== "ok" &&
            cloudinaryResult.result !== "not found"
        ) {
            console.error(
                "Cloudinary delete failed:",
                cloudinaryResult
            );

            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to delete image from Cloudinary",
                },
                { status: 500 }
            );
        }

        // =========================
        // DELETE FROM MONGODB
        // =========================

        await db.collection("events").updateOne(
            { _id: new ObjectId(eventId) },
            {
                $pull: {
                    images: {
                        publicId: publicId,
                    },
                } as any,
                $set: {
                    updatedAt: new Date(),
                },
            }
        );

        return NextResponse.json({
            success: true,
            message: "Photo deleted successfully 🙏",
        });
    } catch (error) {
        console.error("Delete photo error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete photo",
            },
            { status: 500 }
        );
    }
}