"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";

export default function BusinessDashboard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: 0,
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitRequest = async (e: any) => {
    e.preventDefault();

    await api.post("/requests", form);

    alert("Request Posted");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
          Post Automation Request
        </h1>

        <form
          onSubmit={submitRequest}
          className="bg-white p-6 md:p-8 rounded-xl shadow space-y-5"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Automation Title
            </label>

            <input
              name="title"
              placeholder="e.g. Automate Gmail → Slack notifications"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe the automation you need..."
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium mb-1">Budget ($)</label>

            <input
              name="budget"
              placeholder="e.g. 200"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Post Request
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
