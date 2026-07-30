# ADR 003 — Timer approach and XP calculation method

## Date
2026-07

## Status
Accepted

## Context
Week 5 originally planned a shared/synced Pomodoro timer — one participant starts it
and all others see the same countdown via Pusher. XP was planned to be awarded per
completed Pomodoro.

After reviewing the UX and comparing with Studyverse's actual approach, both decisions
were reconsidered.

---

## Decision 1 — Individual timers over shared/synced timer

Each participant runs their own Pomodoro timer independently on their own client.
No Pusher broadcasting of timer state.

### Reason
A shared timer creates real UX problems:
- Users joining mid-session see a timer already partway through
- Only one person can control the timer for the whole room, which feels wrong
- Pusher sync adds complexity with no meaningful benefit

The "studying together" feeling comes from presence (seeing others in the room)
and chat — not from literally running the same countdown. Individual timers
are more respectful of each user's own work rhythm.

### Trade-off accepted
The Pusher timer sync work in #47 was abandoned. The timer API route was removed.

---

## Decision 2 — Time-based XP over Pomodoro-completion-based XP

XP is awarded based on time spent in a room: 1 XP per minute, calculated when
the user leaves. No Pomodoro completion tracking required.

### Reason
- Simpler to implement — duration is already calculated on session end
- More forgiving UX — users earn XP even if they don't complete a full Pomodoro
- Closer to how Studyverse actually rewarded study time
- Removes the need for a separate Pomodoro recording API route

### Trade-off accepted
No distinction between focused work time and break time in XP calculation.
All time in a room counts equally. This is acceptable for v1.

---

## Impact on schema
The Pomodoro table remains in the schema for potential future use but will not
be written to in v1. StudySession.xpEarned will reflect time-based XP only.