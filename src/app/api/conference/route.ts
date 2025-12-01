// app/api/conference/route.ts
import dbConnect from "@/lib/dbconnect";
import ConferenceModel from "@/model/conference";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const conferencesData = await request.json();

        // Check if it's a single conference or multiple conferences
        const isArray = Array.isArray(conferencesData);
        const conferencesToProcess = isArray ? conferencesData : [conferencesData];

        // Validate all conferences first
        const validationErrors: string[] = [];
        
        for (const conference of conferencesToProcess) {
            const { title, authors, conference: conferenceName, year, month } = conference;
            
            // Check required fields
            if (!title) {
                validationErrors.push(`Missing title for conference entry`);
                continue;
            }
            if (!authors) {
                validationErrors.push(`Missing authors for conference: "${title}"`);
                continue;
            }
            if (!conferenceName) {
                validationErrors.push(`Missing conference name for: "${title}"`);
                continue;
            }
            if (!year) {
                validationErrors.push(`Missing year for conference: "${title}"`);
                continue;
            }

            // Check for duplicates
            const existingConference = await ConferenceModel.findOne({ 
                title, 
                authors, 
                conference: conferenceName, 
                year 
            });
            
            if (existingConference) {
                validationErrors.push(`Conference "${title}" by ${authors} (${year}) already exists`);
            }
        }

        if (validationErrors.length > 0) {
            return Response.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: validationErrors
                },
                {
                    status: 400
                }
            );
        }

        // Create all conferences
        const createdConferences = [];
        for (const conferenceData of conferencesToProcess) {
            const { 
                title, 
                authors, 
                conference: conferenceName, 
                year, 
                month, 
                location, 
                pages, 
                type, 
                status 
            } = conferenceData;

            const newConference = new ConferenceModel({
                title,
                authors: authors || "",
                conference: conferenceName || "",
                year: year || null,
                month: month || "",
                location: location || "",
                pages: pages || "",
                type: type || "",
                status: status || ""
            });

            await newConference.save();
            createdConferences.push(newConference);
        }

        return Response.json(
            {
                success: true,
                message: isArray 
                    ? `${createdConferences.length} conferences added successfully`
                    : "Conference added successfully",
                data: isArray ? createdConferences : createdConferences[0]
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.log("Internal server error", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            {
                status: 500
            }
        );
    }
}

// Keep your existing GET function
export async function GET(){
    await dbConnect()

    try {
        const conferences = await ConferenceModel.find().sort({ _id : -1})

        return Response.json(
            {
                success:true,
                message:"Conferences fetched successfully",
                data:conferences
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.log("Internal server error",error)

        return Response.json(
            {
                success:false,
                message:"Internal server error"
            },
            {
                status:500
            }
        )
    }
}