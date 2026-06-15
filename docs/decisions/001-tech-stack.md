# ADR 001 — Tech stack selection

## Date
2025-06

## Status
Accepted

## Decision
Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, NextAuth.js, Prisma, PostgreSQL via Supabase, Pusher, deployed on Vercel.

---

## Next.js 15 over React + Vite
Lokk requires server-side API routes for auth, XP logic, and session management. Next.js collapses frontend and backend into one project with one deployment. A Vite setup would require a separate Express server deployed independently.

**Trade-off accepted:** App Router learning curve in week 1.

---

## PostgreSQL (Supabase) over MongoDB
Lokk's data model has real relational structure — users join rooms, rooms have sessions, sessions have Pomodoros. These relationships are handled naturally by a relational database. Prisma gives type-safe queries and a single schema file as source of truth.

**Trade-off accepted:** Schema migrations require more discipline than schema-less.

---

## Pusher over raw WebSockets
Vercel's serverless functions do not support persistent connections. Pusher handles WebSocket infrastructure on a free tier (200k messages/day, 100 concurrent connections) while still enabling full WebSocket architecture discussion.

**Trade-off accepted:** Vendor dependency. Free tier limited to 100 concurrent connections.

---

## NextAuth.js for authentication
Provides GitHub and Google OAuth in ~1 day of setup. Includes a Prisma adapter that automatically creates and retrieves USER records on login.

**Trade-off accepted:** NextAuth v5 App Router docs are still maturing.