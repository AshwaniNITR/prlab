import dbConnect from "@/lib/dbconnect";
import TeamModel from "@/model/team";
import { NextRequest, NextResponse } from "next/server";
import streamUpload from "@/lib/uploadOnCloudinary";

export async function POST(request: NextRequest) {
    await dbConnect()

    try {
        const formData = await request.formData();
        const membersMap = new Map<number, any>();

        // Parse formData into an array of objects
        for (const [key, value] of formData.entries()) {
            const match = key.match(/^members\[(\d+)\]\[(\w+)\]$/);
            if (match) {
                const index = parseInt(match[1]);
                const field = match[2];
                if (!membersMap.has(index)) {
                    membersMap.set(index, {});
                }
                membersMap.get(index)[field] = value;
            }
        }

        const teamToProcess = Array.from(membersMap.values());

        if (teamToProcess.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No team members data found"
                },
                { status: 400 }
            );
        }

        // Create all team
        let createdTeam = [];
        for (const teamData of teamToProcess) {
            const { name, image: imageFile, designation, enrolledDate, graduatedDate, description: Description } = teamData;

            if (!name || !designation) {
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

            const newTeamMember = new TeamModel({
                name,
                image: imageUrl || "",
                designation,
                enrolledDate: enrolledDate || null,
                graduatedDate: graduatedDate || null,
                Description
            })

            await newTeamMember.save();
            createdTeam.push(newTeamMember);
        }


        return Response.json(
            {
                success: true,
                message: `${createdTeam.length} team members added successfully`,
                data: createdTeam
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
        const team = await TeamModel.find().sort({ _id: -1 })

        return NextResponse.json(
            {
                success: true,
                message: "Team fetched successfully",
                data: team
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