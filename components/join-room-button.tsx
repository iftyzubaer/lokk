"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinRoomButton({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleJoin() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/rooms/${roomId}/join`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to join room");
        return;
      }

      router.push(`/rooms/${roomId}`);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleJoin}
        disabled={loading}
        className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50 shrink-0"
      >
        {loading ? "Joining..." : "Join"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}