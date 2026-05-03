// app/api/aboutus/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import AboutUsModel from "@/model/aboutus";

interface UpdateAboutUsData {
  missionVision?: string;
  coreObjectives?: string;
  capabilities?: string;
  contributions?: string[];
  researchFields?: string[];
}

// PUT - Full replace of the AboutUs document by id
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params;
    const id = Number(params.id);

    const existing = await AboutUsModel.findOne({ id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "AboutUs not found" },
        { status: 404 }
      );
    }

    const body: UpdateAboutUsData = await request.json();

    const updatedData = {
      missionVision: body.missionVision ?? "",
      coreObjectives: body.coreObjectives ?? "",
      capabilities: body.capabilities ?? "",
      contributions: body.contributions ?? [],
      researchFields: body.researchFields ?? [],
    };

    const updated = await AboutUsModel.findOneAndUpdate(
      { id },
      { ...updatedData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, message: "AboutUs fully updated", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error replacing AboutUs:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ success: false, error: messages.join(", ") }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to replace AboutUs" },
      { status: 500 }
    );
  }
}

// PATCH - Partial update of the AboutUs document by id
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params;
    const id = Number(params.id);

    const existing = await AboutUsModel.findOne({ id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "AboutUs not found" },
        { status: 404 }
      );
    }

    const body: UpdateAboutUsData = await request.json();

    // Only set fields that were actually sent
    const updateFields: Partial<UpdateAboutUsData> = {};
    if (body.missionVision !== undefined) updateFields.missionVision = body.missionVision;
    if (body.coreObjectives !== undefined) updateFields.coreObjectives = body.coreObjectives;
    if (body.capabilities !== undefined) updateFields.capabilities = body.capabilities;
    if (body.contributions !== undefined) updateFields.contributions = body.contributions;
    if (body.researchFields !== undefined) updateFields.researchFields = body.researchFields;

    const updated = await AboutUsModel.findOneAndUpdate(
      { id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, message: "AboutUs updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating AboutUs:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ success: false, error: messages.join(", ") }, { status: 400 });
    }

    if (error.name === "CastError") {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to update AboutUs" },
      { status: 500 }
    );
  }
}

// DELETE - Delete the AboutUs document by id
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params;
    const id = Number(params.id);

    const existing = await AboutUsModel.findOne({ id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "AboutUs not found" },
        { status: 404 }
      );
    }

    await AboutUsModel.findOneAndDelete({ id });

    return NextResponse.json(
      { success: true, message: "AboutUs deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting AboutUs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete AboutUs" },
      { status: 500 }
    );
  }
}