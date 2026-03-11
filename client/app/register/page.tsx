"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "business",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      router.push("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg grid md:grid-cols-2 overflow-hidden">
        {/* Left Branding Section */}
        <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-10">
          <h2 className="text-3xl font-bold mb-4">Join AutoMatch AI 🚀</h2>

          <p className="text-blue-100 mb-6">
            Connect businesses with top automation experts and build powerful AI
            workflows.
          </p>

          <ul className="space-y-2 text-sm">
            <li>✔ Find skilled automation experts</li>
            <li>✔ Build scalable workflows</li>
            <li>✔ Grow your automation business</li>
          </ul>
        </div>

        {/* Register Form */}
        <div className="p-8 md:p-12">
          <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                name="name"
                placeholder="John Doe"
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm text-gray-600">Account Type</label>
              <select
                name="role"
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="business">Business</option>
                <option value="expert">Automation Expert</option>
              </select>
            </div>

            {/* Button */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
