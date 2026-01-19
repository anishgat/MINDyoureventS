import type { EventInput, EventItem, Signup } from "@/lib/types/event";
import type { User, UserRole } from "@/lib/types/user";

const STORAGE_KEY = "hack4good_role";

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

let currentUser: User = {
  id: "user-001",
  name: "Taylor Nguyen",
  role: "participant",
};

let mockUsers: User[] = [
  { id: "user-001", name: "Taylor Nguyen", role: "participant" },
  { id: "user-002", name: "Ava Patel", role: "participant" },
  { id: "user-003", name: "Noah Kim", role: "participant" },
  { id: "user-004", name: "Mia Johnson", role: "participant" },
  { id: "vol-001", name: "Alex Chen", role: "volunteer" },
  { id: "vol-002", name: "Jordan Martinez", role: "volunteer" },
  { id: "vol-003", name: "Sam Taylor", role: "volunteer" },
  { id: "admin-001", name: "Casey Rivera", role: "admin" },
];

let mockEvents: EventItem[] = [
  {
    id: "evt-1001",
    title: "River Clean-Up Sprint",
    description:
      "Join a morning sweep along the river. We provide gloves, bags, and snacks.",
    date: formatDate(new Date(year, month, 3)),
    startTime: "08:30",
    endTime: "11:00",
    location: "Harbor Greenway",
    imageUrl: "/eventImages/riverCleanup.jpeg",
    capacity: 40,
    volunteerQuota: 8,
    volunteerEventType: "experienced", // Yellow - experienced volunteers only
    questions: [
      "Do you have any accessibility needs we should plan for?",
      "Do you need us to provide gloves or other gear?",
    ],
    createdBy: "staff-1",
    createdAt: new Date().toISOString(),
  },
  // Same-day (multi-event) example: date matches evt-1001
  {
    id: "evt-1010",
    title: "River Picnic & Games",
    description:
      "A relaxed picnic with simple outdoor games right after the clean-up. Bring a water bottle—snacks provided!",
    date: formatDate(new Date(year, month, 3)),
    startTime: "12:30",
    endTime: "14:00",
    location: "Harbor Greenway Lawn",
    imageUrl: "/eventImages/riverPicnic.jpg",
    capacity: 50,
    questions: [],
    createdBy: "staff-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-1002",
    title: "Food Pantry Packathon",
    description:
      "Help pack and label meal kits for families. Stations rotate every 20 minutes.",
    date: formatDate(new Date(year, month, 5)),
    startTime: "13:00",
    endTime: "16:00",
    location: "Northside Community Hub",
    imageUrl: "/eventImages/foodPackathon.jpg",
    capacity: 60,
    volunteerQuota: 12,
    volunteerEventType: "volunteer_only", // Blue - volunteer/external matters only
    questions: [
      "Do you have prior pantry or warehouse experience?",
      "Can you lift boxes up to 25 lbs?",
    ],
    createdBy: "staff-2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-1003",
    title: "Youth Tech Mentoring",
    description:
      "Support students with hardware builds and project demos in an open lab.",
    date: formatDate(new Date(year, month, 8)),
    startTime: "17:30",
    endTime: "19:30",
    location: "Hope Learning Lab",
    imageUrl: "/eventImages/techMentoring.jpg",
    capacity: 25,
    volunteerQuota: 5,
    questions: [],
    createdBy: "staff-3",
    createdAt: new Date().toISOString(),
  },
  // Same-day (multi-event) example: date matches evt-1003
  {
    id: "evt-1011",
    title: "Tech Demo Showcase",
    description:
      "A short, fun showcase where teams demo what they built. Great for families and first-time attendees.",
    date: formatDate(new Date(year, month, 8)),
    startTime: "19:45",
    endTime: "20:30",
    location: "Hope Learning Lab (Main Hall)",
    imageUrl: "/eventImages/techShowcase.jpg",
    capacity: 60,
    questions: [],
    createdBy: "staff-3",
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-1004",
    title: "Neighborhood Story Night",
    description:
      "Collect oral histories from longtime residents. Training included onsite.",
    date: formatDate(new Date(year, month, 12)),
    startTime: "18:00",
    endTime: "20:00",
    location: "Edison Arts Center",
    imageUrl: "/eventImages/storyNight.jpg",
    capacity: 30,
    volunteerQuota: 6,
    questions: [],
    createdBy: "staff-4",
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-1005",
    title: "Shelter Garden Build",
    description:
      "Assemble planter boxes and lay soil beds for the winter harvest.",
    date: formatDate(new Date(year, month, 18)),
    startTime: "09:00",
    endTime: "12:30",
    location: "Westgate Shelter Courtyard",
    imageUrl: "/eventImages/gardenBuilding.jpg",
    capacity: 35,
    volunteerQuota: 7,
    questions: [],
    createdBy: "staff-5",
    createdAt: new Date().toISOString(),
  },
];

let mockSignups: Signup[] = [
  {
    id: "signup-2001",
    eventId: "evt-1002",
    userId: "user-001",
    role: "participant",
    createdAt: new Date().toISOString(),
  },
];

function seedVolunteerSignups() {
  const volunteerUsers = mockUsers.filter((u) => u.role === "volunteer");
  for (const event of mockEvents) {
    if (!event.volunteerQuota || event.volunteerQuota <= 0) {
      continue;
    }
    const existingVolunteerCount = mockSignups.filter(
      (signup) => signup.eventId === event.id && signup.role === "volunteer"
    ).length;
    const remaining = Math.max(0, event.volunteerQuota - existingVolunteerCount);
    const toAdd = Math.min(remaining, volunteerUsers.length, 3);
    for (let i = 0; i < toAdd; i += 1) {
      const volunteer = volunteerUsers[i];
      const alreadySignedUp = mockSignups.some(
        (signup) =>
          signup.eventId === event.id &&
          signup.userId === volunteer.id &&
          signup.role === "volunteer"
      );
      if (alreadySignedUp) {
        continue;
      }
      mockSignups.push({
        id: `seed-vol-${event.id}-${volunteer.id}`,
        eventId: event.id,
        userId: volunteer.id,
        role: "volunteer",
        createdAt: new Date().toISOString(),
      });
    }
  }
}

seedVolunteerSignups();

const getStoredRole = (): UserRole | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === "admin" || value === "participant" || value === "volunteer") {
    return value;
  }
  return null;
};

export async function getCurrentUser(): Promise<User> {
  const storedRole = getStoredRole();
  if (storedRole && storedRole !== currentUser.role) {
    currentUser = { ...currentUser, role: storedRole };
    mockUsers = mockUsers.map((user) =>
      user.id === currentUser.id ? { ...user, role: storedRole } : user
    );
  }
  return { ...currentUser };
}

export async function setCurrentUserRole(role: UserRole) {
  currentUser = { ...currentUser, role };
  mockUsers = mockUsers.map((user) =>
    user.id === currentUser.id ? { ...user, role } : user
  );
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, role);
  }
  await delay(120);
  return { ...currentUser };
}

export async function setCurrentUserName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    return { ...currentUser };
  }
  currentUser = { ...currentUser, name: trimmed };
  mockUsers = mockUsers.map((user) =>
    user.id === currentUser.id ? { ...user, name: trimmed } : user
  );
  await delay(80);
  return { ...currentUser };
}

export async function listEvents(): Promise<EventItem[]> {
  await delay();
  return [...mockEvents];
}

export async function listUserSignups(userId: string): Promise<Signup[]> {
  await delay();
  return mockSignups.filter((signup) => signup.userId === userId);
}

export async function listUsers(): Promise<User[]> {
  await delay();
  return [...mockUsers];
}

export async function listEventSignups(eventId: string): Promise<Signup[]> {
  await delay();
  return mockSignups.filter((signup) => signup.eventId === eventId);
}

export async function toggleSignup(
  eventId: string,
  userId: string,
  role: UserRole
): Promise<Signup[]> {
  await delay(120);
  const event = mockEvents.find((evt) => evt.id === eventId);
  if (!event) {
    return mockSignups.filter((signup) => signup.userId === userId);
  }

  const existing = mockSignups.find(
    (signup) => signup.eventId === eventId && signup.userId === userId
  );

  if (existing) {
    mockSignups = mockSignups.filter((signup) => signup.id !== existing.id);
    return mockSignups.filter((signup) => signup.userId === userId);
  }

  // Enforce participant capacity
  if (role === "participant" && event.capacity > 0) {
    const currentParticipants = mockSignups.filter(
      (signup) => signup.eventId === eventId && signup.role === "participant"
    ).length;
    if (currentParticipants >= event.capacity) {
      return mockSignups.filter((signup) => signup.userId === userId);
    }
  }

  // Enforce volunteer quota
  if (role === "volunteer") {
    if (event.volunteerEventType === "quota_reached") {
      return mockSignups.filter((signup) => signup.userId === userId);
    }
    if (event.volunteerQuota !== undefined && event.volunteerQuota > 0) {
      const currentVolunteers = mockSignups.filter(
        (signup) => signup.eventId === eventId && signup.role === "volunteer"
      ).length;
      if (currentVolunteers >= event.volunteerQuota) {
        return mockSignups.filter((signup) => signup.userId === userId);
      }
    }
  }

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `signup-${Math.random().toString(16).slice(2)}`;

  mockSignups = [
    ...mockSignups,
    {
      id,
      eventId,
      userId,
      role,
      createdAt: new Date().toISOString(),
    },
  ];

  return mockSignups.filter((signup) => signup.userId === userId);
}

export async function createEvent(input: EventInput): Promise<EventItem> {
  await delay(200);
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `evt-${Math.random().toString(16).slice(2)}`;
  const event: EventItem = {
    id,
    ...input,
    capacity: input.capacity ?? 0,
    questions: input.questions ?? [],
    createdBy: currentUser.id,
    createdAt: new Date().toISOString(),
  };
  mockEvents = [event, ...mockEvents];
  return event;
}
