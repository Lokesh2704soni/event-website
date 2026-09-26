import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifySession } from "@/lib/auth";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        // 1. Check admin session
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

        // 2. Get uploaded file
        const formData = await request.formData();

        const file = formData.get("file");
        const eventId = formData.get("eventId")?.toString();

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Image file is required",
                },
                { status: 400 }
            );
        }

        if (!eventId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event ID is required",
                },
                { status: 400 }
            );
        }

        // 3. Convert image to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 4. Upload image to Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "khatu-shyam/events",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(buffer);
        });

        // 5. Connect MongoDB
        const client = await clientPromise;
        const db = client.db("khatu_mandir");

        // 6. Image information
        const imageData = {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            createdAt: new Date(),
        };

        // 7. Save image URL inside event
        const result = await db.collection("events").updateOne(
            { _id: new ObjectId(eventId) },
            {
                $push: {
                    images: imageData,
                } as any,
                $set: {
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

        // 8. Success response
        return NextResponse.json({
            success: true,
            message: "Image uploaded successfully 🙏",
            image: imageData,
        });
    } catch (error) {
        console.error("Gallery upload error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Image upload failed",
            },
            { status: 500 }
        );
    }
}