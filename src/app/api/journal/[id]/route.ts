import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import JournalModel from '@/model/journal';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params;
    const id = params.id;
    
    // Check if Journal exists
    const existingJournal = await JournalModel.findById(id);
    if (!existingJournal) {
      return NextResponse.json(
        { error: 'Journal not found' },
        { status: 404 }
      );
    }

    let updateData: any = {};
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      updateData = {
        title: formData.get('title') as string || existingJournal.title,
        authors: formData.get('authors') as string || existingJournal.authors,
        journal: formData.get('journal') as string || existingJournal.journal,
        year: formData.get('year') ? Number(formData.get('year')) : existingJournal.year,
        volume: formData.get('volume') as string || existingJournal.volume,
        issue: formData.get('issue') as string || existingJournal.issue,
        pages: formData.get('pages') as string || existingJournal.pages,
        type: formData.get('type') as string || existingJournal.type,
        status: formData.get('status') as string || existingJournal.status,
      };
    } else {
      const jsonData = await request.json();
      updateData = {
        title: jsonData.title || existingJournal.title,
        authors: jsonData.authors || existingJournal.authors,
        journal: jsonData.journal || existingJournal.journal,
        year: jsonData.year ? Number(jsonData.year) : existingJournal.year,
        volume: jsonData.volume || existingJournal.volume,
        issue: jsonData.issue || existingJournal.issue,
        pages: jsonData.pages || existingJournal.pages,
        type: jsonData.type || existingJournal.type,
        status: jsonData.status || existingJournal.status,
      };
    }

    if (!updateData.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const updatedJournal = await JournalModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedJournal) {
      return NextResponse.json(
        { error: 'Failed to update journal' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedJournal,
      message: 'Journal updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating journal:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid journal ID' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update journal' }, { status: 500 });
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

    const existingJournal = await JournalModel.findById(id);
    if (!existingJournal) {
      return NextResponse.json(
        { error: 'Journal not found' },
        { status: 404 }
      );
    }
    
    await JournalModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Journal deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete journal' }, { status: 500 });
  }
}
