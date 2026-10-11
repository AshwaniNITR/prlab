// src/types/course.ts
export type CourseType = 'Theory' | 'Practical';

export interface ICourse {
  _id?: string;
  name: string;
  type: CourseType;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseDTO {
  _id: string;
  name: string;
  type: CourseType;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}