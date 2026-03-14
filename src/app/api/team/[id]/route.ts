import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import TeamModel from '@/model/team';
import streamUpload from '@/lib/uploadOnCloudinary';
import {v2 as cloudinary} from 'cloudinary';

interface UpdateTeamMemberData {
  name?: string;
  image?: string | File; // Could be URL string or new File
  enrolledDate?: string;
  graduatedDate?: string | null;
  designation?: string;
  description?: string;
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
    const existingMember = await TeamModel.findById(id);
    if (!existingMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
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
        name: formData.get('name') as string || existingMember.name,
        enrolledDate: formData.get('enrolledDate') 
          ? new Date(formData.get('enrolledDate') as string)
          : existingMember.enrolledDate,
        graduatedDate: formData.get('graduatedDate')
          ? new Date(formData.get('graduatedDate') as string)
          : existingMember.graduatedDate,
        designation: formData.get('designation') as string || existingMember.designation,
        Description: (formData.get('description') as string) || (existingMember.Description as string),
      };

      // Handle image upload if provided
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        // Delete old image from Cloudinary
        try {
          if (existingMember.image) {
            const parts = existingMember.image.split('/');
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
      const jsonData = await request.json() as UpdateTeamMemberData;
      
      updateData = {
        name: jsonData.name || existingMember.name,
        enrolledDate: jsonData.enrolledDate 
          ? new Date(jsonData.enrolledDate)
          : existingMember.enrolledDate,
        graduatedDate: jsonData.graduatedDate === null 
          ? null 
          : jsonData.graduatedDate 
            ? new Date(jsonData.graduatedDate)
            : existingMember.graduatedDate,
        designation: jsonData.designation || existingMember.designation,
        Description: jsonData.description || (existingMember.Description as string),
      };

      // Handle image update if new URL is provided
      if (jsonData.image && typeof jsonData.image === 'string') {
        updateData.image = jsonData.image;
      }
    }

    // Validate required fields
    if (!updateData.name || !updateData.enrolledDate || !updateData.designation || !updateData.Description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the team member
    const updatedMember = await TeamModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return NextResponse.json(
        { error: 'Failed to update team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMember,
      message: 'Team member updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating team member:', error);
    
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
        { error: 'Invalid team member ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update team member' },
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

    const existingMember = await TeamModel.findById(id);
    if (!existingMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    try {
      if (existingMember.image) {
        const parts = existingMember.image.split('/');
        const publicId = parts[parts.length - 1].split('.')[0];
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    } catch (e) {
      console.error('Failed to delete old image', e);
    }
    
    await TeamModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete team member' },
      { status: 500 }
    );
  }
}


// Helper type for TypeScript
interface ITeamMember {
  name: string;
  image: string;
  enrolledDate: Date;
  graduatedDate?: Date | null;
  designation: string;
  Description: string;
}