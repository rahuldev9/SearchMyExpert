"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function UserForm() {
  const [role, setRole] = useState("business");
  const [loading, setLoading] = useState(false);

  const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      phone: formData.get("phone"),
      bio: formData.get("bio"),
      experience: formData.get("experience"),
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL!, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      toast.success("Submitted successfully");
      e.target.reset();
    } catch (error) {
      toast.error("Submission failed");
      console.error(error);
    }

    setLoading(false);
  };
  return (
    <div className=" flex items-center justify-center  p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white text-center p-6">
          <h1 className="text-2xl font-bold">
            Connect Businesses with Experts
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Businesses can post projects and experts collaborate through our
            platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Grid Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                name="name"
                required
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Role *
              </label>

              <select
                name="role"
                required
                onChange={(e) => setRole(e.target.value)}
                className="w-full border text-black border-gray-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="business">Business</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                name="phone"
                type="number"
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Experience (Expert Only) */}
            {role === "expert" && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Years of Experience
                </label>

                <input
                  name="experience"
                  type="number"
                  placeholder="e.g. 3 years"
                  className="w-full border text-black border-gray-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Bio</label>

              <textarea
                name="bio"
                placeholder="Tell us about yourself"
                className="w-full border text-black border-gray-300 rounded-lg p-2.5 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition shadow-md"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
