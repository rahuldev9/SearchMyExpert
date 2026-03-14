"use client";

import { useEffect, useRef, useState } from "react";
import API from "@/lib/api";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { getCurrentUser } from "@/lib/auth";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export default function ProjectChat({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchMessages();

    socket.emit("joinProject", projectId);

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

    const newMessage = {
      projectId,
      message: text,
      senderId: currentUser._id,
      senderName: currentUser.name,
      createdAt: new Date(),
    };

    try {
      await API.post(`/chat/${projectId}`, {
        message: text,
      });

      // socket.emit("sendMessage", newMessage);

      setText("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[550px] bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden m-2">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-white">
          <h2 className="text-lg font-semibold text-gray-800">{projectId}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-gray-400 text-sm text-center mt-10">
              Start the conversation
            </p>
          )}

          {messages.map((m, i) => {
            const senderId =
              typeof m.senderId === "object" ? m.senderId._id : m.senderId;

            const isMe = senderId === currentUser?.id;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[70%]">
                  {!isMe && (
                    <p className="text-xs text-gray-500 mb-1">
                      {m.senderId?.name || m.senderName || "User"}
                    </p>
                  )}

                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow ${
                      isMe
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {m.message}
                  </div>

                  <p
                    className={`text-[10px] mt-1 ${
                      isMe
                        ? "text-right text-gray-300"
                        : "text-left text-gray-400"
                    }`}
                  >
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
              </motion.div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 flex gap-3 items-center bg-white">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={sendMessage}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
