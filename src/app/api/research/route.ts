import dbConnect from "@/lib/dbconnect";
//import TeamModel from "@/model/team";
import ResearchModel from "@/model/research";
import { NextRequest, NextResponse } from "next/server";
import streamUpload from "@/lib/uploadOnCloudinary";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const formData = await request.formData();
        const researchMap = new Map<number, any>();

        // Parse formData into an array of objects
        for (const [key, value] of formData.entries()) {
            const match = key.match(/^members\[(\d+)\]\[(\w+)\]$/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                if (!researchMap.has(index)) {
                    researchMap.set(index, {});
                }
                researchMap.get(index)[field] = value;
            }
        }

        const researchToProcess = Array.from(researchMap.values());

        if (researchToProcess.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No research data found"
                },
                { status: 400 }
            );
        }

        // Create all research      
        let createdResearch  = [];
        for (const researchData of researchToProcess) {
            const { title, image: imageFile, description } = researchData;

            if (!title || !description) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Title and description are required"
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
                
            const newResearch = new ResearchModel({
                title,
                image: imageUrl || "",
                description
            })

            await newResearch.save();
            createdResearch.push(newResearch);
        }


        return Response.json(
            {
                success: true,
                message: `${createdResearch.length} research items added successfully`,
                data: createdResearch
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
        const research = await ResearchModel.find().sort({ _id: -1 })

        return NextResponse.json(
            {
                success: true,
                message: "Research items fetched successfully",
                data: research
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