import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import ResearchModel from '@/model/research';
import streamUpload from '@/lib/uploadOnCloudinary';
import { v2 as cloudinary } from 'cloudinary';

interface UpdateResearchData {
  title?: string;
  description?: string;
  image?: string | File;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params;
    const id = params.id;
    
    // Check if research exists
    const existingResearch = await ResearchModel.findById(id);
    if (!existingResearch) {
      return NextResponse.json(
        { error: 'Research not found' },
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
      
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      
      if (title) updateData.title = title;
      if (description) updateData.description = description;

      // Handle image upload if provided
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        // Delete old image from Cloudinary
        try {
          if (existingResearch.image) {
            const parts = existingResearch.image.split('/');
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
      const jsonData = await request.json() as UpdateResearchData;
      
      if (jsonData.title) updateData.title = jsonData.title;
      if (jsonData.description) updateData.description = jsonData.description;
      if (jsonData.image && typeof jsonData.image === 'string') {
        updateData.image = jsonData.image;
      }
    }

    // Validate required fields for Research model (only title and description are required)
    if (!updateData.title && !updateData.description && !updateData.image) {
      // If no fields to update, return error
      return NextResponse.json(
        { error: 'At least one field (title, description, or image) is required for update' },
        { status: 400 }
      );
    }

    // Update the research item
    const updatedResearch = await ResearchModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedResearch) {
      return NextResponse.json(
        { error: 'Failed to update research' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedResearch,
      message: 'Research updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating research:', error);
    
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
        { error: 'Invalid research ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update research' },
      { status: 500 }
    );
  }
}

// DELETE endpoint
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params;
    const id = params.id;

    const existingResearch = await ResearchModel.findById(id);
    if (!existingResearch) {
      return NextResponse.json(
        { error: 'Research not found' },
        { status: 404 }
      );
    }

    try {
      if (existingResearch.image) {
        const parts = existingResearch.image.split('/');
        const publicId = parts[parts.length - 1].split('.')[0];
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    } catch (e) {
      console.error('Failed to delete image from Cloudinary:', e);
    }
    
    await ResearchModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Research deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting research:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete research' },
      { status: 500 }
    );
  }
}