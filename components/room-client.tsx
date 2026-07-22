"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import Image from "next/image";

interface Participant {
  id: string;
  name: string | null;
  image: string | null;
}

interface RoomClientProps {
  roomId: string;
  initialParticipants: Participant[];
}

export default function RoomClient({
  roomId,
  initialParticipants,
}: RoomClientProps) {
  const [participants, setParticipants] = useState<Participant[]>(
    initialParticipants.filter(
      (p, index, self) => index === self.findIndex((t) => t.id === p.id)
    )
  );
    

  useEffect(() => {
    const channel = pusherClient.subscribe(`room-${roomId}`);

    channel.bind("user-joined", (data: Participant) => {
      setParticipants((prev) => {
        const exists = prev.find((p) => p.id === data.id);
        if (exists) return prev;
        return [...prev, data];
      });
    });

    channel.bind("user-left", (data: { id: string }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== data.id));
    });

    return () => {
      pusherClient.unsubscribe(`room-${roomId}`);
    };
  }, [roomId]);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-gray-600">
        In this room ({participants.length})
      </h2>

      {participants.length === 0 ? (
        <p className="text-sm text-gray-400">
          No one here yet — be the first to join.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {participants.map((participant) => (
            <li
              key={participant.id}
              className="flex items-center gap-3 rounded-md border px-4 py-3"
            >
              {participant.image ? (
                <Image
                  src={participant.image}
                  alt={participant.name ?? "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                  {participant.name?.[0] ?? "?"}
                </div>
              )}
              <span className="text-sm font-medium">{participant.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}