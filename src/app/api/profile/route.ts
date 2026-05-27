// app/api/profile/route.ts
import dbConnect from "@/lib/dbconnect";
import ProfileModel, { IProfile } from "@/model/profile";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const data = await ProfileModel.findOne();

    if (!data) {
      return Response.json(
        { success: false, message: "No Profile data found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Profile data fetched successfully", data },
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

    const { id, content } = body;

    if (!id) {
      return Response.json(
        { success: false, message: "Missing required field: id" },
        { status: 400 }
      );
    }

    if (!content || !Array.isArray(content) || content.length === 0) {
      return Response.json(
        { success: false, message: "Missing required field: content (must be a non-empty array)" },
        { status: 400 }
      );
    }

    // Check for duplicate id
    const existing = await ProfileModel.findOne({ id });
    if (existing) {
      return Response.json(
        { success: false, message: `Profile with id ${id} already exists. Use PATCH to update.` },
        { status: 409 }
      );
    }

    const newProfile = new ProfileModel({
      id,
      content,
    });

    await newProfile.save();

    return Response.json(
      { success: true, message: "Profile data created successfully", data: newProfile },
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
export async function PATCH(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { id, content } = body;

    if (!id) {
      return Response.json(
        { success: false, message: "Missing required field: id" },
        { status: 400 }
      );
    }

    if (!content || !Array.isArray(content) || content.length === 0) {
      return Response.json(
        { success: false, message: "content must be a non-empty array" },
        { status: 400 }
      );
    }

    const updatedProfile   = await ProfileModel.findOneAndUpdate(
      { id },
      { content },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return Response.json(
        { success: false, message: `Profile with id ${id} not found` },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Profile data updated successfully", data: updatedProfile },
      { status: 200 }
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

export async function DELETE(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, message: "Missing required query parameter: id" },
        { status: 400 }
      );
    }

    const deletedProfile = await ProfileModel.findOneAndDelete({ id: parseInt(id) });

    if (!deletedProfile) {
      return Response.json(
        { success: false, message: `Profile with id ${id} not found` },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Profile data deleted successfully" },
      { status: 200 }
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