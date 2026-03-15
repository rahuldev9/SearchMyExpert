"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, X, MessageCircle } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello 👋 How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong." },
      ]);
    }

    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition"
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-[360px] h-[500px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold">AI Assistant</span>
            </div>

            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/60">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  m.role === "user" ? "justify-end" : ""
                }`}
              >
                {m.role === "assistant" && (
                  <div className="bg-blue-600 text-white p-2 rounded-full shadow">
                    <Bot size={15} />
                  </div>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] shadow-sm ${
                    m.role === "user" ? "bg-blue-600 text-white" : "bg-white/80"
                  }`}
                >
                  {m.content}
                </div>

                {m.role === "user" && (
                  <div className="bg-gray-800 text-white p-2 rounded-full shadow">
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500 animate-pulse">
                AI is typing...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white/80 backdrop-blur flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask something..."
              className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
