import type { EventInput, EventItem, Signup } from "@/lib/types/event";
import type { User, UserRole } from "@/lib/types/user";
import * as mock from "./mock";
import * as volunteers from "./volunteers";

export async function getCurrentUser(): Promise<User> {
  return mock.getCurrentUser();
}

export async function setCurrentUserRole(role: UserRole): Promise<User> {
  return mock.setCurrentUserRole(role);
}

export async function setCurrentUserName(name: string): Promise<User> {
  return mock.setCurrentUserName(name);
}

export async function listEvents(): Promise<EventItem[]> {
  return mock.listEvents();
}

export async function listUserSignups(userId: string): Promise<Signup[]> {
  return mock.listUserSignups(userId);
}

export async function listUsers(): Promise<User[]> {
  return mock.listUsers();
}

export async function listEventSignups(eventId: string): Promise<Signup[]> {
  return mock.listEventSignups(eventId);
}

export async function toggleSignup(
  eventId: string,
  userId: string,
  role: UserRole
): Promise<Signup[]> {
  return mock.toggleSignup(eventId, userId, role);
}

export async function createEvent(input: EventInput): Promise<EventItem> {
  return mock.createEvent(input);
}

// Volunteer functions
export const getVolunteersForEvent = volunteers.getVolunteersForEvent;
export const addVolunteerToEvent = volunteers.addVolunteerToEvent;
export const removeVolunteerFromEvent = volunteers.removeVolunteerFromEvent;
export const initializeVolunteersForEvent = volunteers.initializeVolunteersForEvent;
