# Hack4Good Frontend

Next.js + TypeScript frontend for Hack4Good 2026. This package includes the login flow, event dashboard (calendar + list views), and admin-only create event page. Mock data is used until the backend is ready.

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
