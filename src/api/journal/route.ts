import dbConnect from "@/lib/dbconnect";
import JournalModel from "@/model/journal";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { title, author, journal, year, volume, issue, pages, type, status } = await request.json()

        const existingJournal = await JournalModel.findOne({ title, author, journal, year, volume })

        if (existingJournal) {
            return Response.json(
                {
                    success: false,
                    message: "Journal with the same name and author already exists"
                },
                {
                    status: 400
                }
            )
        }

        const newJournal = new JournalModel({
            title,
            author: author || "",
            journal: journal || "",
            year: year || null,
            volume: volume || "",
            issue: issue || "",
            pages: pages || "",
            type: type || "",
            status: status || ""
        })

        await newJournal.save()

        return Response.json(
            {
                success: true,
                message: "Journal added successfully",
                data:newJournal
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Internal server error", error)
        return Response.json(
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

export async function GET(){
    await dbConnect()

    try {
        const journals = await JournalModel.find().sort({ _id : -1})

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