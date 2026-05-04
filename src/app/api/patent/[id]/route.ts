import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import PatentModel from '@/model/patent';
import mongoose from 'mongoose';

// 🔥 helper: safe date parsing
const parseDate = (value: any, fallback: any) => {
  if (!value) return fallback;

  const d = new Date(value);
  return isNaN(d.getTime()) ? fallback : d;
};

// ================= PATCH =================
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    // 🔥 1. Validate ID BEFORE DB hit
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid patent ID' },
        { status: 400 }
      );
    }

    // 🔥 2. Get existing once
    const existingPatent = await PatentModel.findById(id);
    if (!existingPatent) {
      return NextResponse.json(
        { error: 'Patent not found' },
        { status: 404 }
      );
    }

    let updateData: any = {};
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();

      updateData = {
        title: (formData.get('title') as string) || existingPatent.title,
        Applno: (formData.get('Applno') as string) || existingPatent.Applno,
        Status: (formData.get('Status') as string) || existingPatent.Status,
        Inventors: (formData.get('Inventors') as string) || existingPatent.Inventors,
        FilingDate: parseDate(formData.get('FilingDate'), existingPatent.FilingDate),
        GrantDate: parseDate(formData.get('GrantDate'), existingPatent.GrantDate),
      };

    } else {
      const jsonData = await request.json();

      updateData = {
        title: jsonData.title || existingPatent.title,
        Applno: jsonData.Applno || existingPatent.Applno,
        Status: jsonData.Status || existingPatent.Status,
        Inventors: jsonData.Inventors || existingPatent.Inventors,
        FilingDate: parseDate(jsonData.FilingDate, existingPatent.FilingDate),
        GrantDate: parseDate(jsonData.GrantDate, existingPatent.GrantDate),
      };
    }

    // 🔥 3. Required field check
    if (!updateData.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // 🔥 4. Update + return plain object
    const updatedPatent = await PatentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json({
      success: true,
      data: {
        ...updatedPatent,
        _id: updatedPatent?._id.toString(), // 🔥 always string
      },
      message: 'Patent updated successfully',
    });

  } catch (error: any) {
    console.error('PATCH ERROR:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update patent' },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    // 🔥 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid patent ID' },
        { status: 400 }
      );
    }

    // 🔥 2. Delete directly (no need to fetch first)
    const deleted = await PatentModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Patent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Patent deleted successfully',
    });

  } catch (error: any) {
    console.error('DELETE ERROR:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to delete patent' },
      { status: 500 }
    );
  }
}