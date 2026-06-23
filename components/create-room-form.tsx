"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoomForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Room name is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subject }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push(`/rooms/${data.id}`);
    } catch {
      setError("Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Room name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Calculus grind"
          className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Maths, Physics, DSA..."
          className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          disabled={loading}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create room"}
      </button>
    </form>
  );
}