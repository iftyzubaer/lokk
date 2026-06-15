# Database schema

## Overview

Lokk uses PostgreSQL via Supabase, accessed through Prisma ORM. The schema is defined in `prisma/schema.prisma` and is the single source of truth for the data model.

## Tables

### USER
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | String | From OAuth provider |
| email | String | Unique |
| avatar_url | String? | From OAuth provider |
| xp | Int | Default 0 |
| streak_count | Int | Default 0 |
| last_active | Date? | Date of last completed session |
| created_at | DateTime | Auto |

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

### SESSION
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
| session_id | UUID | FK → SESSION.id |
| work_minutes | Int | Default 25 |
| break_minutes | Int | Default 5 |
| status | String | running / completed / cancelled |
| started_at | DateTime | Auto |

## XP calculation
- 10 XP per completed Pomodoro
- 1 XP per minute of study time
- Streak bonus: +20 XP if user studied yesterday