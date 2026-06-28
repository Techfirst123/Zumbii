# Zumbii Project – Agent Instructions

## Project Structure

```
Zumbii/
├── frontend/          # Next.js 15 app (React 19, Tailwind v4, Framer Motion)
├── backend/           # NestJS API (Prisma, PostgreSQL, Redis, Elasticsearch)
├── docker-compose.yml # PostgreSQL, MongoDB, Redis, Elasticsearch, Kibana
├── AGENTS.md          # This file
└── .gitignore
```

## Commands

### Frontend
- `cd frontend && npm run dev` – Start dev server (port 3000)
- `cd frontend && npm run build` – Production build (verify before committing)
- `cd frontend && npm run lint` – ESLint check

### Backend
- `cd backend && npm run start:dev` – Start NestJS in watch mode (port 4000)
- `cd backend && npm run build` – Compile TypeScript
- `cd backend && npx prisma generate` – Regenerate Prisma client after schema changes
- `cd backend && npx prisma db push` – Push schema to database (dev only)
- `cd backend && npx prisma studio` – Open Prisma Studio (GUI database browser)

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
