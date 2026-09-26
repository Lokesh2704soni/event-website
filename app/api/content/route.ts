import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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
            "Public content error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to load website content",
            },
            {
                status: 500,
            }
        );
    }
}