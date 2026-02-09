import dbConnect from "@/lib/dbconnect";
import EventModel from "@/model/event";
import { NextRequest, NextResponse } from "next/server";
import streamUpload from "@/lib/uploadOnCloudinary";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const formData = await request.formData();
        const eventsMap = new Map<number, any>();

        // Parse formData into an array of objects
        for (const [key, value] of formData.entries()) {
            const match = key.match(/^events\[(\d+)\]\[(\w+)\]$/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                if (!eventsMap.has(index)) {
                    eventsMap.set(index, {});
                }
                eventsMap.get(index)[field] = value;
            }
        }

        const eventsToProcess = Array.from(eventsMap.values());

        if (eventsToProcess.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No events data found"
                },
                { status: 400 }
            );
        }

        // Create all events
        let createdEvents = [];
        for (const eventData of eventsToProcess) {
            const { title, description, date, time, location, image: imageFile } = eventData;

            if (!title || !description || !date || !time || !location) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Name and designation are required"
                    },
                    { status: 400 }
                );
            }

            let imageUrl = "";
            //upload image on cloudinary
            if (imageFile && imageFile instanceof File) {
                const arrayBuffer = await imageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const uploadResult = await streamUpload(buffer);
                imageUrl = uploadResult.secure_url;
            }

            const newEvent = new EventModel({
                title,
                description,
                date,
                time,
                location,
                image: imageUrl || ""
            })

            await newEvent.save();
            createdEvents.push(newEvent);
        }


        return Response.json(
            {
                success: true,
                message: `${createdEvents.length} events added successfully`,
                data: createdEvents
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Internal server error", error)

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error"
            },
            {
                status: 500
            }
        )
    }
}

export async function GET() {
    await dbConnect()

    try {
        const events = await EventModel.find().sort({ _id: -1 })

        return NextResponse.json(
            {
                success: true,
                message: "Events fetched successfully",
                data: events
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Internal server error", error)

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error"
            },
            {
                status: 500
            }
        )
    }
}