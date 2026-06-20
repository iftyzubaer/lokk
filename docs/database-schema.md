# Database schema

## Overview

Lokk uses PostgreSQL via Supabase, accessed through Prisma ORM. The schema is defined in `prisma/schema.prisma` and is the single source of truth for the data model.

## Note on auth tables

`User`, `Account`, `Session`, and `VerificationToken` follow NextAuth's Prisma adapter requirements. The original `Session` model (study sessions) was renamed to `StudySession` to avoid colliding with NextAuth's own `Session` table, which stores auth sessions.

## Tables

### USER
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | String? | From OAuth provider |
| email | String | Unique |
| email_verified | DateTime? | Managed by NextAuth |
| image | String? | Profile photo from OAuth provider |
| xp | Int | Default 0 |
| streak_count | Int | Default 0 |
| last_active | Date? | Date of last completed session |
| created_at | DateTime | Auto |

### ACCOUNT
Managed by NextAuth's Prisma adapter. Links a user to their OAuth provider identity.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → USER.id |
| provider | String | "github" or "google" |
| provider_account_id | String | ID from the provider |
| type | String | "oauth" |

### SESSION
Managed by NextAuth's Prisma adapter. Database-backed auth session — not to be confused with STUDY_SESSION below.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| session_token | String | Unique |
| user_id | UUID | FK → USER.id |
| expires | DateTime | Session expiry |

### VERIFICATION_TOKEN
Managed by NextAuth's Prisma adapter. Used for email-based verification flows — not currently used by Lokk since auth is OAuth-only.

| Column | Type | Notes |
|--------|------|-------|
| identifier | String | — |
| token | String | Unique |
| expires | DateTime | — |

### ROOM
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| host_id | UUID | FK → USER.id |
| name | String | Room display name |
| subject | String? | Optional subject label |
| is_public | Boolean | Default true |
| status | String | waiting / active / ended |
| created_at | DateTime | Auto |

### ROOM_PARTICIPANT
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| room_id | UUID | FK → ROOM.id |
| user_id | UUID | FK → USER.id |
| joined_at | DateTime | Auto |
| left_at | DateTime? | Null while user is still in room |

### STUDY_SESSION
A completed study session — renamed from the original SESSION to avoid colliding with NextAuth's own SESSION table.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → USER.id |
| room_id | UUID | FK → ROOM.id |
| duration_minutes | Int | Calculated on session end |
| xp_earned | Int | Calculated on session end |
| started_at | DateTime | When user joined the room |
| ended_at | DateTime | When user left the room |

### POMODORO
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| study_session_id | UUID | FK → STUDY_SESSION.id |
| work_minutes | Int | Default 25 |
| break_minutes | Int | Default 5 |
| status | String | running / completed / cancelled |
| started_at | DateTime | Auto |

### MESSAGE
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| room_id | UUID | FK → ROOM.id |
| user_id | UUID | FK → USER.id |
| content | String | Message text |
| created_at | DateTime | Auto |

## Relationships
- USER has many ACCOUNTs (one per linked OAuth provider)
- USER has many SESSIONs (NextAuth)
- USER hosts many ROOMs
- USER joins many ROOMs through ROOM_PARTICIPANT
- USER has many STUDY_SESSIONs
- USER sends many MESSAGEs
- ROOM has many ROOM_PARTICIPANTs
- ROOM has many STUDY_SESSIONs
- ROOM has many MESSAGEs
- STUDY_SESSION has many POMODOROs

## XP calculation
- 10 XP per completed Pomodoro
- 1 XP per minute of study time
- Streak bonus: +20 XP if user studied the previous day

## Streak calculation
- `last_active` is updated to today's date at session end
- If `last_active` was yesterday → increment `streak_count`
- If `last_active` was 2+ days ago → reset `streak_count` to 1