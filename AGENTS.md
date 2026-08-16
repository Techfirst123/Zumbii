# Zumbii Project – Agent Instructions

## Project Structure

The backend now lives in a separate repo: https://github.com/Techfirst123/Zumbii-admin
(extracted from this repo's former `backend/` folder via `git subtree split`).
This repo (`Zumbii`) contains the frontend only, deployed to Vercel.

```
Zumbii/
├── frontend/          # Next.js 15 app (React 19, Tailwind v4, Framer Motion)
├── docker-compose.yml # PostgreSQL, MongoDB, Redis, Elasticsearch, Kibana
├── vercel.json        # Frontend-only build/routes
├── AGENTS.md          # This file
└── .gitignore
```

The frontend talks to the backend over HTTP via `NEXT_PUBLIC_API_URL`
(see `frontend/src/lib/api.ts`) — set this to the backend's deployed URL,
not a same-origin path.

## Commands

### Frontend
- `cd frontend && npm run dev` – Start dev server (port 3000)
- `cd frontend && npm run build` – Production build (verify before committing)
- `cd frontend && npm run lint` – ESLint check

### Backend
See https://github.com/Techfirst123/Zumbii-admin for backend commands
(NestJS, Prisma, Redis, Elasticsearch). Backend changes are committed there directly.

### Infrastructure
- `docker-compose up -d` – Start all services (PostgreSQL, MongoDB, Redis, Elasticsearch, Kibana)
- `docker-compose down` – Stop all services

## Architecture

- **Frontend**: Next.js 15 with App Router, Tailwind CSS v4, Framer Motion, Zustand
- **Backend**: NestJS with RESTful API, Prisma ORM, JWT auth, Swagger docs
- **Databases**: PostgreSQL (primary), MongoDB (analytics), Redis (cache/sessions)
- **Search**: Elasticsearch for product search

## Code Conventions

- Use `'use client'` for interactive pages/components
- Use framer-motion for animations, lucide-react for icons
- Glassmorphism design: apply `glass` utility class
- Tailwind v4: use `@theme` tokens, `@utility` for custom classes
- No comments in production code unless absolutely necessary
