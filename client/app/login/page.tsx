"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const res = await api.post("/auth/login", form);

      const { token, user } = res.data;

      // save JWT
      Cookies.set("token", token, { expires: 7 });

      // save role
      Cookies.set("role", user.role);

      if (user.role === "business") {
        router.push("/dashboard/business");
      } else {
        router.push("/dashboard/expert");
      }
    } catch (err) {
      alert("Invalid login credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg grid md:grid-cols-2 overflow-hidden">
        {/* Left Section (Brand / Info) */}
        <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-10">
          <h2 className="text-3xl font-bold mb-4">Welcome Back 👋</h2>

          <p className="text-blue-100 mb-6">
            Login to connect with automation experts and start building powerful
            workflows for your business.
          </p>

          <ul className="space-y-2 text-sm">
            <li>✔ Hire automation experts</li>
            <li>✔ Build AI workflows</li>
            <li>✔ Scale your business automation</li>
          </ul>
        </div>

        {/* Right Section (Form) */}
        <div className="p-8 md:p-12">
          <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
            Login to your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>

              <input
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>

              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              Login
            </button>
          </form>

          {/* Extra Links */}
          <div className="text-center mt-6 text-sm text-gray-600">
            <p>
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
