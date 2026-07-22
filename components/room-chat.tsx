"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface RoomChatProps {
  roomId: string;
  initialMessages: Message[];
  currentUserId: string;
}

export default function RoomChat({
  roomId,
  initialMessages,
  currentUserId,
}: RoomChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = pusherClient.subscribe(`room-${roomId}`);

    channel.bind("message-sent", (data: Message) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m.id === data.id);
        if (exists) return prev;
        return [...prev, data];
      });
    });

    return () => {
      channel.unbind("message-sent");
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);

    try {
      await fetch(`/api/rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      setInput("");
    } catch {
      console.error("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col border rounded-md h-96">
      <div className="px-4 py-2 border-b">
        <h2 className="text-sm font-medium text-gray-600">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-4">
            No messages yet — say something!
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.user.id === currentUserId
                  ? "flex-row-reverse"
                  : "flex-row"
              }`}
            >
              {message.user.image ? (
                <Image
                  src={message.user.image}
                  alt={message.user.name ?? "User"}
                  width={28}
                  height={28}
                  className="rounded-full shrink-0 self-end"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs shrink-0 self-end">
                  {message.user.name?.[0] ?? "?"}
                </div>
              )}
              <div
                className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                  message.user.id === currentUserId
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex gap-2 p-3 border-t"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message..."
          disabled={sending}
          className="flex-1 rounded-md border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}