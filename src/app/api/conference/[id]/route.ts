import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import ConferenceModel from '@/model/conference';

interface UpdateConferenceData {
  title?: string;
  authors?: string;
  conference?: string;
  year?: number;
  month?: string;
  pages?: string;
  location?: string;
  type?: string;
  status?: string;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params; // ✅ await first
    const id = params.id;                // ✅ then access
    
    // Check if Conference exists
    const existingConference = await ConferenceModel.findById(id);
    if (!existingConference) {
      return NextResponse.json(
        { error: 'Conference not found' },
        { status: 404 }
      );
    }

    let updateData: any = {};

    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      updateData = {
        title: formData.get('title') as string || existingConference.title,
        authors: formData.get('authors') as string || existingConference.authors,
        conference: formData.get('conference') as string || existingConference.conference,
        year: formData.get('year') ? Number(formData.get('year')) : existingConference.year,
        month: formData.get('month') as string || existingConference.month,
        pages: formData.get('pages') as string || existingConference.pages,
        location: formData.get('location') as string || existingConference.location,
        type: formData.get('type') as string || existingConference.type,
        status: formData.get('status') as string || existingConference.status,
      };
    } else {
      // Handle JSON data
      const jsonData = await request.json() as UpdateConferenceData;
      
      updateData = {
        title: jsonData.title || existingConference.title,
        authors: jsonData.authors || existingConference.authors,
        conference: jsonData.conference || existingConference.conference,
        year: jsonData.year || existingConference.year,
        month: jsonData.month || existingConference.month,
        pages: jsonData.pages || existingConference.pages,
        location: jsonData.location || existingConference.location,
        type: jsonData.type || existingConference.type,
        status: jsonData.status || existingConference.status,
      };
    }

    // Validate required fields
    if (!updateData.title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the conference
    const updatedConference = await ConferenceModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedConference) {
      return NextResponse.json(
        { error: 'Failed to update conference' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedConference,
      message: 'Conference updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating conference:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    // Handle CastError (invalid ID)
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid conference ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update conference' },
      { status: 500 }
    );
  }
}

// Optional: Add DELETE endpoint as well
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // 👇 this satisfies runtime without breaking types
    const params = await context.params;
    const id = params.id;

    const existingConference = await ConferenceModel.findById(id);
    if (!existingConference) {
      return NextResponse.json(
        { error: 'Conference not found' },
        { status: 404 }
      );
    }

    await ConferenceModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Conference deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete conference' },
      { status: 500 }
    );
  }
}