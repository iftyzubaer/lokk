"use client";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const PusherClient = require("pusher-js");

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
);