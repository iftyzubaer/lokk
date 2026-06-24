# ADR 002 — Row Level Security on all tables

## Date
2026-06

## Status
Accepted

## Decision
Enable Row Level Security (RLS) on all Supabase tables with no permissive policies defined.

## Reason
Supabase exposes a public PostgREST API at the project URL. Without RLS, any table is
readable and writable by anyone who knows the project URL. Since Lokk uses Prisma ORM
connecting directly via the service role connection string (which bypasses RLS), the
PostgREST API is not needed and should be locked down entirely.

## Effect
All PostgREST API access to all tables is blocked. Prisma is unaffected since it connects
as the database owner via the direct connection string, which bypasses RLS.

## When to revisit
If Lokk ever uses Supabase client-side SDK or Supabase Auth directly, RLS policies will
need to be defined per table to allow appropriate access.