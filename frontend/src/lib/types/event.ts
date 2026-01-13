import type { UserRole } from "./user";

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
