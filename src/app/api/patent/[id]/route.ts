import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import PatentModel from '@/model/patent';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params;
    const id = params.id;
    
    // Check if Patent exists
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
        title: formData.get('title') as string || existingPatent.title,
        Applno: formData.get('Applno') as string || existingPatent.Applno,
        Status: formData.get('Status') as string || existingPatent.Status,
        Inventors: formData.get('Inventors') as string || existingPatent.Inventors,
        FilingDate: formData.get('FilingDate') ? new Date(formData.get('FilingDate') as string) : existingPatent.FilingDate,
        GrantDate: formData.get('GrantDate') ? new Date(formData.get('GrantDate') as string) : existingPatent.GrantDate,
      };
    } else {
      const jsonData = await request.json();
      updateData = {
        title: jsonData.title || existingPatent.title,
        Applno: jsonData.Applno || existingPatent.Applno,
        Status: jsonData.Status || existingPatent.Status,
        Inventors: jsonData.Inventors || existingPatent.Inventors,
        FilingDate: jsonData.FilingDate ? new Date(jsonData.FilingDate) : existingPatent.FilingDate,
        GrantDate: jsonData.GrantDate ? new Date(jsonData.GrantDate) : existingPatent.GrantDate,
      };
    }

    if (!updateData.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const updatedPatent = await PatentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPatent) {
      return NextResponse.json(
        { error: 'Failed to update patent' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPatent,
      message: 'Patent updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating patent:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid patent ID' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update patent' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params;
    const id = params.id;

    const existingPatent = await PatentModel.findById(id);
    if (!existingPatent) {
      return NextResponse.json(
        { error: 'Patent not found' },
        { status: 404 }
      );
    }
    
    await PatentModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Patent deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete patent' }, { status: 500 });
  }
}
