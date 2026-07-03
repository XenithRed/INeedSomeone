# Death Deck

A real-time PvP card game built with React + TypeScript + Vite, using Supabase for auth, database, and realtime.

## Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend:** Supabase (auth + PostgreSQL + realtime)
- **Routing:** React Router v7
- **Build:** Vite 8

## Running the app

```bash
npm run dev
```

The dev server runs on port 5000. The workflow "Start application" handles this automatically.

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public API key |

## Database setup

The full schema is in `supabase-schema.sql`. Run it in the Supabase project's SQL Editor to create all tables and policies. Also enable Realtime for the `rooms` and `room_players` tables in Database → Replication.

## User preferences

- Keep the existing project structure and stack
