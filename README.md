# Hack4Good 2026

Hack4Good 2026 is an event signup platform for a week of community events. Participants and volunteers can browse events and sign up, while staff/admin users can create and manage events.

## Pages

- Login _/login_: authenticate and select a role (mocked for now).
- Event Dashboard _/events_: toggle between calendar month view and chronological list view, plus a secondary list of the current user's signups.
- Create Event _/create-event_ (admin-only): add or update events.

## Repo structure

- frontend/: Next.js + TypeScript app using Tailwind CSS v4 and mock data.
- backend/: Express + Firebase API (planned; not yet in this repo).

## Getting started

The frontend has its own README with setup and scripts.

```bash
cd frontend
npm install
npm run dev
```

## Notes

- Mock event and signup data lives in `frontend/src/lib/api/mock.ts` until the backend is ready.
