# Hack4Good Frontend

Next.js + TypeScript frontend for Hack4Good 2026. This package includes the login flow, event dashboard (calendar + list views), and admin-only create event page. Mock data is used until the backend is ready.

## Problem statement

How might we reduce friction in activity sign-ups for both individuals and caregivers, while reducing manual effort for staff in managing and consolidating registration data?

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run lint` - run ESLint

## Environment variables

Copy the template to `.env.local` when ready to connect the backend.

```bash
cp .env.local.example .env.local
```

## Notes

- The dashboard uses mock data in `src/lib/api/mock.ts`.
- Role switching is stored in local storage via the login page.

## What’s implemented (current)

- **Role routes**: `/participant/events`, `/volunteer/events`, `/admin/events` (shared dashboard UI).
- **Dashboard views**:
  - Calendar month view with event click → details popup → registration flow.
  - Carousel list view with event cards.
  - “My Lineup” panel showing events the current user has signed up for.
- **Participant experience**:
  - Kid-friendly styling + playful sticker icons per event (keyword-based).
- **Volunteer/admin experience**:
  - Calendar legend + color-coded events (yellow/green/blue).
  - Blue events are hidden from participants.
  - Volunteer quota is enforced (quota reached disables registration).
- **Admin experience**:
  - Event details show volunteer list and participant signup list.
- **Storage**:
  - Signups/events are mocked in `src/lib/api/mock.ts`.
  - Volunteer names list is simulated via `localStorage` (`src/lib/api/volunteers.ts`).
