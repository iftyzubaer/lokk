import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      host: {
        select: {
          name: true,
          image: true,
        },
      },
      participants: {
        where: { leftAt: null },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!room) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-8">
      <div className="w-full max-w-xl">

        {/* Room header */}
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-2xl font-semibold">{room.name}</h1>
          {room.subject && (
            <p className="text-gray-500 text-sm">{room.subject}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Hosted by {room.host.name} · {room.status}
          </p>
        </div>

        {/* Participant list */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-gray-600">
            In this room ({room.participants.length})
          </h2>

          {room.participants.length === 0 ? (
            <p className="text-sm text-gray-400">
              No one here yet — be the first to join.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {room.participants.map((participant) => (
                <li
                  key={participant.id}
                  className="flex items-center gap-3 rounded-md border px-4 py-3"
                >
                  {participant.user.image ? (
                    <Image
                      src={participant.user.image}
                      alt={participant.user.name ?? "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      {participant.user.name?.[0] ?? "?"}
                    </div>
                  )}
                  <span className="text-sm font-medium">
                    {participant.user.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}