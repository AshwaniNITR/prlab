// src/models/Course.ts
import mongoose, { Schema, Model, models } from 'mongoose';
import type { ICourse } from '@/types/course';

const CourseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
      maxlength: [200, 'Course name cannot exceed 200 characters'],
      unique: true,
    },
    type: {
      type: String,
      enum: {
        values: ['Theory', 'Practical'],
        message: 'Type must be either "Theory" or "Practical"',
      },
      required: [true, 'Course type is required'],
    },
  },
  {
    timestamps: true,
    collection: 'courses',
  }
);

CourseSchema.index({ type: 1, name: 1 });

const Course: Model<ICourse> =
  (models.Course as Model<ICourse>) || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;