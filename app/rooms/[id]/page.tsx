import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import LeaveRoomButton from "@/components/leave-room-button";
import RoomClient from "@/components/room-client";
import RoomChat from "@/components/room-chat";
import PomodoroTimer from "@/components/pomodoro-timer";

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

  const messages = await prisma.message.findMany({
    where: { roomId: id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    select: { id: true },
  });

  const initialParticipants = room.participants.map((p) => ({
    id: p.user.id,
    name: p.user.name,
    image: p.user.image,
  }));

  const initialMessages = messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    user: {
      id: m.user.id,
      name: m.user.name,
      image: m.user.image,
    },
  }));

  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-8">
      <div className="w-full max-w-xl flex flex-col gap-6">

        {/* Room header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">{room.name}</h1>
            {room.subject && (
              <p className="text-gray-500 text-sm">{room.subject}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Hosted by {room.host.name} · Live
            </p>
          </div>
          <LeaveRoomButton roomId={room.id} />
        </div>

        {/* Real-time participant list */}
        <RoomClient
          roomId={room.id}
          initialParticipants={initialParticipants}
        />

        {/* Pomodoro timer */}
        <PomodoroTimer roomId={room.id} />

        {/* Chat panel */}
        <RoomChat
          roomId={room.id}
          initialMessages={initialMessages}
          currentUserId={currentUser?.id ?? ""}
        />

      </div>
    </main>
  );
}