// Simple file-based storage for volunteer names per event
// In a real app, this would be in a database

const STORAGE_PREFIX = "volunteers_";

function getStorageKey(eventId: string): string {
  return `${STORAGE_PREFIX}${eventId}`;
}

export async function getVolunteersForEvent(eventId: string): Promise<string[]> {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(getStorageKey(eventId));
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading volunteers:", error);
    return [];
  }
}

export async function addVolunteerToEvent(
  eventId: string,
  volunteerName: string
): Promise<string[]> {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const current = await getVolunteersForEvent(eventId);
    // Avoid duplicates
    if (!current.includes(volunteerName)) {
      const updated = [...current, volunteerName];
      window.localStorage.setItem(getStorageKey(eventId), JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch (error) {
    console.error("Error adding volunteer:", error);
    return [];
  }
}

export async function removeVolunteerFromEvent(
  eventId: string,
  volunteerName: string
): Promise<string[]> {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const current = await getVolunteersForEvent(eventId);
    const updated = current.filter((name) => name !== volunteerName);
    window.localStorage.setItem(getStorageKey(eventId), JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error removing volunteer:", error);
    return [];
  }
}

// Initialize with 3 random names for existing events (for demo purposes)
export function initializeVolunteersForEvent(eventId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const key = getStorageKey(eventId);
  if (!window.localStorage.getItem(key)) {
    const initialNames = ["Alex Chen", "Jordan Martinez", "Sam Taylor"];
    window.localStorage.setItem(key, JSON.stringify(initialNames));
  }
}
