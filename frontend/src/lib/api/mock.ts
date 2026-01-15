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
    imageUrl: "",
    capacity: 40,
    questions: [
      "Do you have any accessibility needs we should plan for?",
      "Do you need us to provide gloves or other gear?",
    ],
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
    imageUrl: "",
    capacity: 60,
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
    imageUrl: "",
    capacity: 25,
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
    imageUrl: "",
    capacity: 30,
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
    imageUrl: "",
    capacity: 35,
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
  }
  return { ...currentUser };
}

export async function setCurrentUserRole(role: UserRole) {
  currentUser = { ...currentUser, role };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, role);
  }
  await delay(120);
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

export async function toggleSignup(
  eventId: string,
  userId: string,
  role: UserRole
): Promise<Signup[]> {
  await delay(120);
  const existing = mockSignups.find(
    (signup) => signup.eventId === eventId && signup.userId === userId
  );

  if (existing) {
    mockSignups = mockSignups.filter((signup) => signup.id !== existing.id);
    return mockSignups.filter((signup) => signup.userId === userId);
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
