// src/app/api/courses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import Course from '@/model/Course';
import mongoose from 'mongoose';
import type { ApiResponse, CourseDTO } from '@/types/course';

export const dynamic = 'force-dynamic';

interface Ctx {
  params: Promise<{ id: string }>;
}

// ─────────────────────────────────────────────
// GET /api/courses/:id
// ─────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: 'Invalid course ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const course = await Course.findById(id).lean();
    if (!course) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<CourseDTO>>({
      success: true,
      data: {
        _id: String(course._id),
        name: course.name,
        type: course.type,
        createdAt: course.createdAt ? new Date(course.createdAt).toISOString() : '',
        updatedAt: course.updatedAt ? new Date(course.updatedAt).toISOString() : '',
      },
    });
  } catch (err) {
    console.error('[GET /api/courses/:id]', err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// PUT /api/courses/:id
// Body: { name?, type? }
// ─────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: 'Invalid course ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const update: Record<string, any> = {};
    if (body.name !== undefined) update.name = String(body.name).trim();
    if (body.type !== undefined) update.type = body.type;

    if (Object.keys(update).length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

    const updated = await Course.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<CourseDTO>>({
      success: true,
      data: {
        _id: String(updated._id),
        name: updated.name,
        type: updated.type,
        createdAt: updated.createdAt ? new Date(updated.createdAt).toISOString() : '',
        updatedAt: updated.updatedAt ? new Date(updated.updatedAt).toISOString() : '',
      },
    });
  } catch (err: any) {
    console.error('[PUT /api/courses/:id]', err);
    if (err?.name === 'ValidationError') {
      const firstError = Object.values(err.errors ?? {})[0] as any;
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: firstError?.message ?? 'Validation error' },
        { status: 400 }
      );
    }
    if (err?.code === 11000) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: 'A course with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: err?.message ?? 'Server error' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// DELETE /api/courses/:id
// ─────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: 'Invalid course ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deleted = await Course.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<{ _id: string }>>({
      success: true,
      data: { _id: String(deleted._id) },
    });
  } catch (err) {
    console.error('[DELETE /api/courses/:id]', err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}