import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import JoinRoomButton from "@/components/join-room-button";

interface RoomsPageProps {
  searchParams: Promise<{
    sessionEnd?: string;
    duration?: string;
    xp?: string;
  }>;
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const sessionEnd = params.sessionEnd === "true";
  const duration = params.duration ? parseInt(params.duration) : null;
  const xp = params.xp ? parseInt(params.xp) : null;

  const rooms = await prisma.room.findMany({
    where: { isPublic: true },
    include: {
      host: {
        select: { name: true },
      },
      participants: {
        where: { leftAt: null },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-6">
      <div className="w-full max-w-xl flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Study rooms</h1>
        <Link href="/dashboard" className="text-sm text-gray-500 underline">
          Back to dashboard
        </Link>
      </div>

      {sessionEnd && duration !== null && xp !== null && (
        <div className="w-full max-w-xl rounded-md bg-green-50 border border-green-200 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">
              Session complete
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              {duration} {duration === 1 ? "minute" : "minutes"} studied
              {xp > 0 ? ` · +${xp} XP earned` : " · Study longer to earn XP"}
            </p>
          </div>
          <span className="text-2xl">🎯</span>
        </div>
      )}

      {rooms.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No rooms yet — create one from the dashboard.
        </p>
      ) : (
        <ul className="w-full max-w-xl flex flex-col gap-3">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="rounded-md border p-4 flex items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-1">
                <p className="font-medium">{room.name}</p>
                {room.subject && (
                  <p className="text-sm text-gray-500">{room.subject}</p>
                )}
                <p className="text-xs text-gray-400">
                  Hosted by {room.host.name} · {room.participants.length} in room
                </p>
              </div>
              <JoinRoomButton roomId={room.id} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}