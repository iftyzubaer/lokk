import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (!room.isPublic) {
    return NextResponse.json({ error: "Room is not public" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.roomParticipant.findFirst({
    where: {
      roomId: id,
      userId: user.id,
      leftAt: null,
    },
  });

  if (existing) {
    return NextResponse.json({ message: "Already in room" }, { status: 200 });
  }

  const participant = await prisma.roomParticipant.create({
    data: {
      roomId: id,
      userId: user.id,
    },
  });

  return NextResponse.json(participant, { status: 201 });
}