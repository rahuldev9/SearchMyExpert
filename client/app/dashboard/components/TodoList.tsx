"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function TodoList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review proposals", done: false },
    { id: 2, text: "Reply to messages", done: false },
    { id: 3, text: "Post new project", done: false },
  ]);

  const toggle = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="bg-white border-none rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">To-Do List</h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggle(task.id)}
            className="flex items-center gap-3 border-none border p-3 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <div
              className={`w-5 h-5 border rounded flex items-center justify-center ${
                task.done ? "bg-blue-600 border-blue-600" : ""
              }`}
            >
              {task.done && <Check size={14} className="text-white" />}
            </div>

            <span className={task.done ? "line-through text-gray-400" : ""}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
