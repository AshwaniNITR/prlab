// src/app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import Course from '@/model/Course';
import type { ApiResponse, CourseDTO } from '@/types/course';

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────
// GET /api/courses
// Optional query: ?type=Theory|Practical
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const filter: Record<string, any> = {};
    if (type) filter.type = type;

    const courses = await Course.find(filter).sort({ type: 1, name: 1 }).lean();

    const data: CourseDTO[] = courses.map((c) => ({
      _id: String(c._id),
      name: c.name,
      type: c.type,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : '',
      updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : '',
    }));

    return NextResponse.json<ApiResponse<CourseDTO[]>>({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error('[GET /api/courses]', err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Server error',
      },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// POST /api/courses
// Single: { name, type }
// Bulk:   { courses: [{ name, type }, ...] }
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    // Bulk insert
    if (Array.isArray(body?.courses)) {
      if (body.courses.length === 0) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: 'courses array cannot be empty' },
          { status: 400 }
        );
      }

      const normalized = body.courses.map((c: any) => ({
        name: String(c.name ?? '').trim(),
        type: c.type,
      }));

      const inserted = await Course.insertMany(normalized, { ordered: true });

      return NextResponse.json<ApiResponse<CourseDTO[]>>(
        {
          success: true,
          count: inserted.length,
          data: inserted.map((c) => ({
            _id: String(c._id),
            name: c.name,
            type: c.type,
            createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : '',
            updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : '',
          })),
        },
        { status: 201 }
      );
    }

    // Single insert
    const { name, type } = body ?? {};

    if (!name || !type) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: 'name and type are required' },
        { status: 400 }
      );
    }

    const created = await Course.create({
      name: String(name).trim(),
      type,
    });

    return NextResponse.json<ApiResponse<CourseDTO>>(
      {
        success: true,
        data: {
          _id: String(created._id),
          name: created.name,
          type: created.type,
          createdAt: created.createdAt ? new Date(created.createdAt).toISOString() : '',
          updatedAt: created.updatedAt ? new Date(created.updatedAt).toISOString() : '',
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[POST /api/courses]', err);

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