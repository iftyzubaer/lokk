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

  const body = await req.json();
  const { content } = body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return NextResponse.json(
      { error: "Message content is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      content: content.trim(),
      roomId: id,
      userId: user.id,
    },
  });

  await pusherServer.trigger(`room-${id}`, "message-sent", {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    user: {
      id: user.id,
      name: user.name,
      image: user.image,
    },
  });

  return NextResponse.json(message, { status: 201 });
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;

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

  return NextResponse.json(messages, { status: 200 });
}