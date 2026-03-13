"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import API from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import { showToast } from "@/components/Toast";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();

  const token =
    typeof params.token === "string" ? params.token : params.token?.[0];

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const res = await API.patch(`/auth/reset-password/${token}`, {
        password,
      });

      toast.success(res.data.message);

      router.push("/login");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>

        <p className="text-sm text-gray-500 text-center mt-2">
          Enter your new password
        </p>

        {/* Password */}
        <div className="relative mt-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mt-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password Match */}
        {confirmPassword && !passwordsMatch && (
          <p className="text-red-500 text-xs mt-2">Passwords do not match</p>
        )}

        {/* Button */}
        <button
          onClick={handleReset}
          disabled={loading || !passwordsMatch}
          className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
