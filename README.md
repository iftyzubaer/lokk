# Lokk

Study with friends. Lock in together.

Lokk is a real-time study app where you create or join study rooms, run Pomodoro sessions, earn XP, and track your streaks — built in public over 10 weeks as a portfolio project.

## Tech stack

- Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- NextAuth.js (GitHub + Google OAuth)
- Prisma ORM + PostgreSQL via Supabase
- Pusher (WebSockets for real-time rooms)
- Deployed on Vercel

## Status

In active development. Follow the build on [Instagram](https://instagram.com/iftyzubaer) / [TikTok](https://tiktok.com/@iftyzubaer): @iftyzubaer

## Running locally

```bash
git clone https://github.com/YOUR_USERNAME/lokk
cd lokk
npm install
cp .env.example .env.local
# fill in your env vars — see .env.example for all required keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docs

- [Architecture](docs/architecture.md)
- [Database schema](docs/database-schema.md)
- [Tech stack decision](docs/decisions/001-tech-stack.md)

## Wiki

Full project documentation including requirements, sprint plans, and build log lives in the [GitHub Wiki](../../wiki).

## License

MIT — see [LICENSE](LICENSE) for details.