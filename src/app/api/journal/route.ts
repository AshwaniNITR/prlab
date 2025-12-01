// app/api/journal/route.ts
import dbConnect from "@/lib/dbconnect";
import JournalModel from "@/model/journal";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const journalsData = await request.json();

        // Check if it's a single journal or multiple journals
        const isArray = Array.isArray(journalsData);
        const journalsToProcess = isArray ? journalsData : [journalsData];

        // Validate all journals first
        const validationErrors: string[] = [];
        
        for (const journal of journalsToProcess) {
            const { title, author, journal: journalName, year } = journal;
            
            // Check required fields
            if (!title || !author || !journalName || !year) {
                validationErrors.push(`Missing required fields for journal: ${title || 'Untitled'}`);
                continue;
            }

            // Check for duplicates
            const existingJournal = await JournalModel.findOne({ 
                title, 
                author, 
                journal: journalName, 
                year 
            });
            
            if (existingJournal) {
                validationErrors.push(`Journal "${title}" by ${author} (${year}) already exists`);
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

        // Create all journals
        const createdJournals = [];
        for (const journalData of journalsToProcess) {
            const { 
                title, 
                author, 
                journal: journalName, 
                year, 
                volume, 
                issue, 
                pages, 
                type, 
                status 
            } = journalData;

            const newJournal = new JournalModel({
                title,
                author: author || "",
                journal: journalName || "",
                year: year || null,
                volume: volume || "",
                issue: issue || "",
                pages: pages || "",
                type: type || "",
                status: status || ""
            });

            await newJournal.save();
            createdJournals.push(newJournal);
        }

        return Response.json(
            {
                success: true,
                message: isArray 
                    ? `${createdJournals.length} journals added successfully`
                    : "Journal added successfully",
                data: isArray ? createdJournals : createdJournals[0]
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
        const journals = await JournalModel.find().sort({ _id : -1})
        console.log("Journals fetched successfully", journals.length)
        return Response.json(
            {
                success:true,
                message:"Journals fetched successfully",
                data:journals
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