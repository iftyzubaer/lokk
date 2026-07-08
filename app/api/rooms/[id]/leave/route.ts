import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const participant = await prisma.roomParticipant.findFirst({
    where: {
      roomId: id,
      userId: user.id,
      leftAt: null,
    },
  });

  if (!participant) {
    return NextResponse.json(
      { error: "You are not in this room" },
      { status: 404 }
    );
  }

  await prisma.roomParticipant.update({
    where: { id: participant.id },
    data: { leftAt: new Date() },
  });

  await pusherServer.trigger(`room-${id}`, "user-left", {
    id: user.id,
  });

  return NextResponse.json({ message: "Left room" }, { status: 200 });
}