"use client";

import { useState } from "react";
import API from "@/lib/api";

export default function PayButton({ project }) {
  const [loading, setLoading] = useState(false);

  const payExpert = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/payments/create", {
        projectId: project._id,
      });

      const { url } = res.data;

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={payExpert}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full py-2.5 px-3 text-sm font-medium bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition"
    >
      {loading ? (
        <>
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          Processing...
        </>
      ) : (
        <>Pay ${project.budget}</>
      )}
    </button>
  );
}
