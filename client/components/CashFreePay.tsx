"use client";

import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import API from "@/lib/api";

interface PayButtonProps {
  project: any;
}

export default function PayButton({ project }: PayButtonProps) {
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    try {
      setLoading(true);

      const res = await API.post("/payment/create-order", {
        projectId: project._id,
        amount: project.budget,
      });

      const data = res.data;

      if (!data.payment_session_id) {
        console.error("Invalid session id");
        setLoading(false);
        return;
      }

      const cashfree = await load({
        mode: "sandbox",
      });

      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={startPayment}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg shadow-sm transition"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Processing...
        </>
      ) : (
        <>Pay ${project.budget}</>
      )}
    </button>
  );
}
