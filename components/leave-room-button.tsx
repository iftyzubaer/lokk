"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LeaveRoomButton({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLeave() {
    setLoading(true);

    try {
      const res = await fetch(`/api/rooms/${roomId}/leave`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.durationMinutes !== undefined) {
        router.push(
          `/rooms?sessionEnd=true&duration=${data.durationMinutes}&xp=${data.xpEarned}`
        );
      } else {
        router.push("/rooms");
      }
    } catch {
      router.push("/rooms");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLeave}
      disabled={loading}
      className="rounded-md border px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 hover:border-red-300 disabled:opacity-50 transition-colors"
    >
      {loading ? "Leaving..." : "Leave room"}
    </button>
  );
}