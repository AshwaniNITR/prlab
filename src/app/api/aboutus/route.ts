import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import AboutUsModel from "@/model/aboutus";

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

// GET - Fetch the AboutUs document
export async function GET() {
  try {
    await connectDB();

    const data = await AboutUsModel.findOne();

    if (!data) {
      return NextResponse.json({ message: "No AboutUs data found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch AboutUs data", error }, { status: 500 });
  }
}

// POST - Create a new AboutUs document
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const existing = await AboutUsModel.findOne();
    if (existing) {
      return NextResponse.json({ message: "AboutUs document already exists. Use PUT or PATCH to update." }, { status: 409 });
    }

    const newData = await AboutUsModel.create(body);

    return NextResponse.json(newData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create AboutUs data", error }, { status: 500 });
  }
}

// PUT - Replace the entire AboutUs document
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const updated = await AboutUsModel.findOneAndReplace({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to replace AboutUs data", error }, { status: 500 });
  }
}

// PATCH - Partially update the AboutUs document
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const updated = await AboutUsModel.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update AboutUs data", error }, { status: 500 });
  }
}

// DELETE - Delete the AboutUs document
export async function DELETE() {
  try {
    await connectDB();

    const deleted = await AboutUsModel.findOneAndDelete();

    if (!deleted) {
      return NextResponse.json({ message: "No AboutUs data found to delete" }, { status: 404 });
    }

    return NextResponse.json({ message: "AboutUs data deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete AboutUs data", error }, { status: 500 });
  }
}