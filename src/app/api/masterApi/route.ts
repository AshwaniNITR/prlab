import dbConnect from "@/lib/dbconnect";
import JournalModel from "@/model/journal";
import PatentModel from "@/model/patent";
import ConferenceModel from "@/model/conference";

export async function GET(){
    await dbConnect()

    try {
        const journals = await JournalModel.find().sort({ _id : -1})
        const patents = await PatentModel.find().sort({ _id : -1})
        const conferences = await ConferenceModel.find().sort({ _id : -1})
        const data={
            journals,
            patents,
            conferences
        }
        console.log("Data fetched successfully", data)
        return Response.json(
            {
                success:true,
                message:"Data fetched successfully",
                data:data
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