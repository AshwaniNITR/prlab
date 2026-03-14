import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import EventModel from '@/model/event';
import streamUpload from '@/lib/uploadOnCloudinary';
import {v2 as cloudinary} from 'cloudinary';

interface UpdateEventData {
  title?: string;
    description?: string;
    date?: Date;
    time?: string;
    location?: string;
    image?: string | File;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params; // ✅ await first
  const id = params.id;                // ✅ then access
    
    // Check if team member exists
    const existingEvent = await EventModel.findById(id);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    let updateData: any = {};
    let newImageData: { url: string; publicId: string } | null = null;

    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (if updating image)
      const formData = await request.formData();
      
      updateData = {
        title: formData.get('title') as string || existingEvent.title,
        description: formData.get('description') as string || existingEvent.description,
        date: formData.get('date')
          ? new Date(formData.get('date') as string)
          : existingEvent.date,
        time: formData.get('time') as string || existingEvent.time,
        location: formData.get('location') as string || existingEvent.location,
      };

      // Handle image upload if provided
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        // Delete old image from Cloudinary
        try {
          if (existingEvent.image) {
            const parts = existingEvent.image.split('/');
            const publicId = parts[parts.length - 1].split('.')[0];
            if (publicId) await cloudinary.uploader.destroy(publicId);
          }
        } catch (e) {
          console.error('Failed to delete old image', e);
        }
        
        // Upload new image
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await streamUpload(buffer);

        newImageData = { 
          url: uploadResult.secure_url, 
          publicId: uploadResult.public_id 
        };
        updateData.image = newImageData.url;
      }
    } else {
      // Handle JSON data
      const jsonData = await request.json() as UpdateEventData;
      
      updateData = {
        title: jsonData.title || existingEvent.title,
        description: jsonData.description || existingEvent.description,
        date: jsonData.date === null 
          ? null 
          : jsonData.date 
            ? new Date(jsonData.date)
            : existingEvent.date,
        time: jsonData.time || existingEvent.time,
        location: jsonData.location || existingEvent.location,
      };

      // Handle image update if new URL is provided
      if (jsonData.image && typeof jsonData.image === 'string') {
        updateData.image = jsonData.image;
      }
    }

    // Validate required fields
    if (!updateData.title || !updateData.description || !updateData.date || !updateData.time || !updateData.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the team member
    const updatedEvent = await EventModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating event:', error);
    
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
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update event' },
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

    const existingEvent = await EventModel.findById(id);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    try {
      if (existingEvent.image) {
        const parts = existingEvent.image.split('/');
        const publicId = parts[parts.length - 1].split('.')[0];
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    } catch (e) {
      console.error('Failed to delete old image', e);
    }
    
    await EventModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}