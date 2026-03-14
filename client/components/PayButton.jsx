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
      className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
    >
      {loading ? "Processing..." : "Pay"}
    </button>
  );
}
