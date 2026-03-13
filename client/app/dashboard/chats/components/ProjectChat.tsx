"use client";

import { useEffect, useRef, useState } from "react";
import API from "@/lib/api";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export default function ProjectChat({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchMessages();

    /* join socket room */
    socket.emit("joinProject", projectId);

    /* receive messages */
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchMessages() {
    try {
      const res = await API.get(`/chat/${projectId}`);
      setMessages(res.data || []);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  }

  async function sendMessage() {
    if (!text.trim()) return;

    try {
      await API.post(`/chat/${projectId}`, {
        message: text,
      });

      setText("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col h-[420px]">
      <h2 className="text-white font-semibold mb-3">Project Chat</h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm">No messages yet</p>
        )}

        {messages.map((m, i) => (
          <div key={m._id || i} className="text-sm">
            <span className="text-blue-400 font-semibold">
              {m.senderId?.name || "User"}:
            </span>{" "}
            <span className="text-gray-200">{m.message}</span>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 text-white outline-none"
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
