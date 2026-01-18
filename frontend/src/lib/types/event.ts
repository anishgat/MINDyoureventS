import type { UserRole } from "./user";

export type VolunteerEventType = "experienced" | "quota_reached" | "volunteer_only";

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl?: string;
  capacity: number;
  volunteerQuota?: number; // Total volunteers needed for this event
  volunteerEventType?: VolunteerEventType; // Color coding: experienced (yellow), quota_reached (green), volunteer_only (blue)
  questions: string[];
  createdBy: string;
  createdAt: string;
};

export type EventInput = Omit<EventItem, "id" | "createdAt" | "createdBy">;

export type Signup = {
  id: string;
  eventId: string;
  userId: string;
  role: UserRole;
  createdAt: string;
};
