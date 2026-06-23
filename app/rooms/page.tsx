import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import JoinRoomButton from "@/components/join-room-button";

export default async function RoomsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

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
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 underline"
        >
          Back to dashboard
        </Link>
      </div>

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