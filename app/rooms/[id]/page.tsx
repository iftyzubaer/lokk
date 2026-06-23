import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

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
    },
  });

  if (!room) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{room.name}</h1>
        {room.subject && (
          <p className="text-gray-500 text-sm mt-1">{room.subject}</p>
        )}
        <p className="text-gray-400 text-xs mt-2">
          Hosted by {room.host.name}
        </p>
      </div>
      <div className="rounded-md border px-6 py-3 text-sm text-gray-500">
        Room is {room.status}
      </div>
    </main>
  );
}