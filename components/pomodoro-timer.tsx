"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "work" | "break";

interface PomodoroTimerProps {
  roomId: string;
  onWorkComplete?: () => void;
}

export default function PomodoroTimer({
  roomId,
  onWorkComplete,
}: PomodoroTimerProps) {
  const WORK_SECONDS = 25 * 60;
  const BREAK_SECONDS = 5 * 60;

  const [phase, setPhase] = useState<Phase>("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);

            if (phase === "work") {
              onWorkComplete?.();
              setPhase("break");
              setSecondsLeft(BREAK_SECONDS);
            } else {
              setPhase("work");
              setSecondsLeft(WORK_SECONDS);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running, phase]);

  function handleStart() {
    setRunning(true);
  }

  function handlePause() {
    setRunning(false);
  }

  function handleReset() {
    setRunning(false);
    setPhase("work");
    setSecondsLeft(WORK_SECONDS);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = phase === "work"
    ? ((WORK_SECONDS - secondsLeft) / WORK_SECONDS) * 100
    : ((BREAK_SECONDS - secondsLeft) / BREAK_SECONDS) * 100;

  return (
    <div className="flex flex-col items-center gap-4 rounded-md border p-6">
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            phase === "work"
              ? "bg-black text-white"
              : "bg-green-100 text-green-700"
          }`}
        >
          {phase === "work" ? "Focus" : "Break"}
        </span>
      </div>

      <p className="text-5xl font-mono font-semibold tracking-tight">
        {display}
      </p>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            phase === "work" ? "bg-black" : "bg-green-400"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex gap-2">
        {!running ? (
          <button
            onClick={handleStart}
            className="rounded-md bg-black px-4 py-2 text-sm text-white"
          >
            {secondsLeft === (phase === "work" ? WORK_SECONDS : BREAK_SECONDS)
              ? "Start"
              : "Resume"}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="rounded-md border px-4 py-2 text-sm text-gray-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
}