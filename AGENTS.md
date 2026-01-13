# AGENTS.md

Project overview

- Monorepo with `/frontend` (Next.js + TypeScript) and `/backend` (Express + Firebase).
- The app lets participants and volunteers sign up for events during a week, and view the events they have signed up for.
- Staff/admin users can create and manage events; only admins can access the Create Event page.

## How the application works (rough flow)

1. User logs in on the frontend (Firebase Auth planned).
2. Event Dashboard loads and shows:
   - Main view: toggle between calendar month view and chronological list view.
   - Secondary view: events the current user has signed up for.
3. Users can sign up/unsign for events from the dashboard.
4. Admin users can access the Create Event page to add or update events.
5. Backend enforces auth and role-based access control for all event mutations.

## Core data model (high-level)

- Events: title, description, date, start/end time, location, image, capacity, createdBy, createdAt.
- Signups: eventId, userId, role (participant/volunteer), createdAt.
- Users: role (admin vs participant/volunteer).

## Backend responsibilities

- Expose CRUD endpoints for events and endpoints for signups.
- Verify Firebase Auth tokens; enforce RBAC for admin-only routes.
- Validate inputs and return consistent errors.

## Frontend responsibilities

- Provide pages: Login, Event Dashboard, Create Event.
- Render calendar/list views and expandable event cards.
- Gate admin-only routes and show user-specific signups.

## Project-wide guidelines

- Make small, reviewable changes and follow existing patterns.
- Avoid new dependencies unless clearly justified.
- Do not add telemetry or external network calls unless explicitly requested.
- Keep secrets out of the repo; use env vars and templates.
- Add or update tests for new behavior when practical.

## Notes

- `/frontend/AGENTS.md` and `/backend/AGENTS.md` will define package-specific conventions and commands.
