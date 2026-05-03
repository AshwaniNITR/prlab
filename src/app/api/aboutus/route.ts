// app/api/aboutus/route.ts
import dbConnect from "@/lib/dbconnect";
import AboutUsModel from "@/model/aboutus";

export async function GET() {
  await dbConnect();

  try {
    const data = await AboutUsModel.findOne();

    if (!data) {
      return Response.json(
        { success: false, message: "No AboutUs data found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "AboutUs data fetched successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.log("Internal server error", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    const { id, missionVision, coreObjectives, capabilities, contributions, researchFields } = body;

    if (!id) {
      return Response.json(
        { success: false, message: "Missing required field: id" },
        { status: 400 }
      );
    }

    // Check for duplicate id
    const existing = await AboutUsModel.findOne({ id });
    if (existing) {
      return Response.json(
        { success: false, message: `AboutUs with id ${id} already exists. Use PATCH to update.` },
        { status: 409 }
      );
    }

    const newAboutUs = new AboutUsModel({
      id,
      missionVision: missionVision || "",
      coreObjectives: coreObjectives || "",
      capabilities: capabilities || "",
      contributions: contributions || [],
      researchFields: researchFields || [],
    });

    await newAboutUs.save();

    return Response.json(
      { success: true, message: "AboutUs data created successfully", data: newAboutUs },
      { status: 201 }
    );
  } catch (error) {
    console.log("Internal server error", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}