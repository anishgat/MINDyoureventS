import type { EventItem, VolunteerEventType } from "@/lib/types/event";
import { getVolunteersForEvent } from "@/lib/api/volunteers";

export type EventColor = "yellow" | "green" | "blue" | "default";

/**
 * Determines the color of an event based on volunteer event type and quota status
 * Only applies to volunteers and admins
 */
export async function getEventColor(
  event: EventItem,
  userRole?: string
): Promise<EventColor> {
  // Only apply colors for volunteers and admins
  if (userRole !== "volunteer" && userRole !== "admin") {
    return "default";
  }

  // Check if quota is reached (for green color)
  if (event.volunteerEventType === "quota_reached") {
    return "green";
  }

  // Check if quota is actually reached by comparing volunteers vs quota
  if (event.volunteerQuota !== undefined) {
    const volunteers = await getVolunteersForEvent(event.id);
    if (volunteers.length >= event.volunteerQuota) {
      return "green"; // Quota reached
    }
  }

  // Map volunteer event types to colors
  switch (event.volunteerEventType) {
    case "experienced":
      return "yellow";
    case "volunteer_only":
      return "blue";
    case "quota_reached":
      return "green";
    default:
      return "default";
  }
}

/**
 * Synchronous version that checks if quota is reached based on current volunteers count
 */
export function isQuotaReached(
  event: EventItem,
  currentVolunteerCount: number
): boolean {
  if (event.volunteerEventType === "quota_reached") {
    return true;
  }
  if (event.volunteerQuota !== undefined) {
    return currentVolunteerCount >= event.volunteerQuota;
  }
  return false;
}

/**
 * Get CSS classes for event color styling
 */
export function getEventColorClasses(color: EventColor): string {
  switch (color) {
    case "yellow":
      return "border-l-4 border-l-yellow-400 bg-yellow-50/50";
    case "green":
      return "border-l-4 border-l-green-500 bg-green-50/50";
    case "blue":
      return "border-l-4 border-l-blue-500 bg-blue-50/50";
    default:
      return "";
  }
}
