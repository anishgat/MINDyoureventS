# AGENTS.md

## Frontend overview

- Next.js + TypeScript app for login, event dashboard, and admin-only create event.
- Start with in-memory mock data and a simple API abstraction so we can swap in real backend endpoints later.
- Tailwind CSS v4 for styling with a modern, clean UI.
- Prefer CSS variables for shared colors and theme tokens.

## UI goals

- Modern, clean layout with clear hierarchy and accessible spacing.
- Calendar month view and chronological list view for events.
- Expandable event cards in list view with concise collapsed state.

## Styling guidelines

- Define repeated colors in CSS variables (e.g., `:root` in `globals.css`).
- Use Tailwind utilities and `@theme`/`@layer` as needed; avoid custom CSS unless necessary.
- Keep components presentational and reusable; prefer composition over deep nesting.
- Use #01A4E3 as the primary color which is in line with the company color.

## Mock data and API plan

- Keep mock event/signups data in a dedicated module (no hardcoded data inside components).
- Use a lightweight API client layer that can switch between mock and real endpoints.

## Source architecture (proposed)

frontend/
└── src/
├── app/
│ ├── (auth)/
│ │ └── login/page.tsx # Login page
│ └── (dashboard)/
│ ├── events/page.tsx # Dashboard main view
│ └── create-event/page.tsx # Admin-only event form
├── components/
│ ├── event/
│ │ ├── EventCalendar.tsx # Month grid view
│ │ ├── EventCard.tsx # Expandable list item
│ │ └── EventList.tsx # Chronological list view
│ └── layout/
│ ├── Sidebar.tsx # Navigation + secondary view
│ └── TopNav.tsx # App header
├── lib/
│ ├── api/
│ │ ├── client.ts # API client abstraction
│ │ └── mock.ts # In-memory mock data
│ └── types/
│ ├── event.ts # Event DTOs
│ └── user.ts # User/role types
└── styles/
└── globals.css # CSS variables + Tailwind base

## Notes

- This file is frontend-specific; see the repo root `AGENTS.md` for project-wide guidance.
