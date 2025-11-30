import dbConnect from "@/lib/dbconnect";
import PatentModel from "@/model/patent";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { title, Applno, Status, Inventors, FilingDate, GrantDate } = await request.json();

        const existingPatent = await PatentModel.findOne({ Applno })

        if (existingPatent) {
            return Response.json(
                {
                    success: false,
                    message: "Patent with this applno already exists"
                },
                {
                    status: 400
                }
            )
        }

        const newPatent = new PatentModel({
            title: title,
            Applno: Applno,
            Status,
            Inventors: Inventors || "",
            FilingDate: FilingDate || null,
            GrantDate: GrantDate || null
        })

        await newPatent.save();

        return Response.json(
            {
                success: true,
                message: "Patent added succcessfully",
                data:newPatent
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Internal server error", error);
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

export async function GET() {
    await dbConnect()

    try {
        const patents = await PatentModel.find().sort({ _id: -1 })

        return Response.json(
            {
                success: true,
                message: "Patents fetched successfully",
                data: patents
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