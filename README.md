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

## API keys and environment setup

The frontend expects Firebase and Gemini API keys when those features are enabled. Create `frontend/.env.local` and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_GEMINI_API_KEY=...
```

You can find the Firebase values in your Firebase project settings, and the Gemini key in your Google AI Studio account. These values are exposed to the client by Next.js, so only use public credentials intended for frontend use.

## Notes

- Mock event and signup data lives in `frontend/src/lib/api/mock.ts` until the backend is ready.
