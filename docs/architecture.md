# Architecture

## Overview

Lokk is a full-stack web application built on Next.js 15. The frontend, API layer, and server logic all live in one Next.js project deployed on Vercel. Real-time functionality is handled by Pusher over WebSockets. Data is persisted in PostgreSQL via Supabase, accessed through Prisma ORM.

## System layers

### Browser (client)
- React components with Tailwind CSS and shadcn/ui
- Pusher client SDK — maintains a persistent WebSocket connection while the user is in a study room
- Sends HTTP requests to Next.js API routes for all data operations

### Next.js server (on Vercel)
- API routes handle all business logic: creating rooms, joining sessions, calculating XP, managing streaks
- NextAuth.js handles OAuth authentication and issues JWT session tokens
- On room events (user joins/leaves), the server triggers a Pusher event

### Supabase (PostgreSQL)
- Primary data store for all application data
- Accessed via Prisma ORM — type-safe queries, schema-as-code

### Pusher (WebSockets)
- Handles real-time room presence and live events
- Server triggers events via Pusher HTTP API after writing to the database
- Pusher pushes those events to all connected clients in the room channel
- Clients do not write directly to Pusher — all events are server-triggered

## Data flow — joining a study room

1. User clicks "Join room" in the browser
2. Browser sends POST request to `/api/rooms/[id]/join`
3. API route verifies session token (NextAuth)
4. API route writes `ROOM_PARTICIPANT` record to Supabase via Prisma
5. API route triggers `user-joined` event on Pusher channel `room-[id]`
6. Pusher pushes event to all browsers connected to that channel
7. Other users' UIs update instantly — new participant appears in the room

## Data flow — session end and XP

1. User leaves the room (closes tab or clicks leave)
2. Browser sends POST to `/api/sessions/end`
3. API route calculates session duration
4. API route calculates XP earned (10 XP per completed Pomodoro + 1 XP per minute)
5. API route writes `SESSION` record to Supabase
6. API route increments `USER.xp` and checks / updates streak
7. Dashboard reflects updated XP and streak