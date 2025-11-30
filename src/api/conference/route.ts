import dbConnect from "@/lib/dbconnect";
import ConferenceModel from "@/model/conference";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { title, authors, conference, year, month, pages, location, type, status } = await request.json()

        const existingConference = await ConferenceModel.findOne({ title, authors, conference, year })

        if (existingConference) {
            return Response.json(
                {
                    success: false,
                    message: "conference with the same name and authors already exists"
                },
                {
                    status: 400
                }
            )
        }

        const newConference = new ConferenceModel({
            title,
            authors: authors || "",
            conference: conference || "",
            year: year || null,
            month: month || "",
            location: location || "",
            pages: pages || "",
            type: type || "",
            status: status || ""
        })

        await newConference.save()

        return Response.json(
            {
                success: true,
                message: "Journal added successfully",
                data:newConference
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