// types/event.ts
export interface EventItem {
  _id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  time?: string;
  location?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface EventApiResponse {
  success: boolean;
  message?: string;
  data?: EventItem[];
}