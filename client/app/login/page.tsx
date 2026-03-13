"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed, Frown } from "lucide-react";
import { showToast } from "@/components/Toast";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { setCurrentUser } from "@/lib/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    if (!form.email.trim()) {
      toast.error("Email is required!");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required!");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      toast.success(`${res.data.message}`);
      const role = res.data.user.role;
      setCurrentUser(res.data.user._id);

      if (role === "business") {
        router.push("/dashboard/business");
      } else {
        router.push("/dashboard/expert");
      }
    } catch (err: any) {
      toast.error(`${err?.response?.data?.message || "Invalid credentials."}`);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    if (!form.email) {
      return toast.error("Email is required");
    }
    const email = form.email;
    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", { email });

      toast.success(res.data.message || "Reset link sent");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to send reset link");
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
              {forgotMode ? "Reset Password" : "Welcome Back 👋"}
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              {forgotMode
                ? "Enter your email to receive reset link."
                : "Login to continue coding."}
            </p>
          </div>

          {/* Email */}
          <div className="mt-6">
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, email: value });

                if (!value) {
                  setErrors({ email: "Email is required." });
                } else if (!isValidEmail(value)) {
                  setErrors({ email: "Enter a valid email address." });
                } else {
                  setErrors({ email: "" });
                }
              }}
              className={`w-full rounded-xl border px-4 py-3 text-sm sm:text-base transition focus:outline-none focus:ring-2
              ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}

          {/* Password */}
          {!forgotMode && (
            <div className="relative mt-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-900 transition"
              >
                {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {/* Primary Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={forgotMode ? forgotPassword : login}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl font-semibold text-white
            bg-blue-500 hover:bg-blue-600
            transition shadow-lg disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : forgotMode
                ? "Send Reset Link"
                : "Login"}
          </motion.button>

          {/* Divider */}
          {!forgotMode && (
            <>
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-4 text-xs text-gray-400 uppercase">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <GoogleSignInButton />
            </>
          )}

          {/* Toggle Links */}
          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            {!forgotMode ? (
              <>
                <p
                  onClick={() => setForgotMode(true)}
                  className="text-blue-500 cursor-pointer hover:underline"
                >
                  Forgot Password?
                </p>

                <p>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => router.push("/register")}
                    className="text-blue-500 cursor-pointer hover:underline"
                  >
                    Create Account
                  </span>
                </p>
              </>
            ) : (
              <p
                onClick={() => setForgotMode(false)}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Back to Login
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
