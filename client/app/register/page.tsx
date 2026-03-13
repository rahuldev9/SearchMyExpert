"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { motion } from "framer-motion";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "business",
  });

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error("Full name is required.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form);

      toast.success(res.data.message || "Registered successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create your account
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Start coding and track your daily progress 🚀
            </p>
          </div>

          {/* Role Switch */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mt-6">
            <button
              onClick={() => setForm({ ...form, role: "business" })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition
              ${
                form.role === "business"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Business
            </button>

            <button
              onClick={() => setForm({ ...form, role: "expert" })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition
              ${
                form.role === "expert"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Expert
            </button>
          </div>

          {/* Form */}
          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm({ ...form, email: value });

                  if (!value.trim()) {
                    setErrors((prev) => ({
                      ...prev,
                      email: "Email is required.",
                    }));
                  } else if (!isValidEmail(value)) {
                    setErrors((prev) => ({
                      ...prev,
                      email: "Please enter a valid email address.",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      email: "",
                    }));
                  }
                }}
                className={`w-full border rounded-xl px-4 py-3 text-sm sm:text-base transition
                focus:outline-none focus:ring-2
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-900 transition"
              >
                {show ? <EyeClosed size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Primary Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={submit}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl font-semibold text-white
            bg-blue-500 hover:bg-blue-600
            transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-xs text-gray-400 uppercase">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google Sign In */}
          <GoogleSignInButton />

          {/* Login Link */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
