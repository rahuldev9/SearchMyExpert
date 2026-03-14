"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import API from "@/lib/api";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    async function confirmPayment() {
      try {
        if (!projectId) return;

        await API.post("/auth/payments/confirm", { projectId });

        setConfirmed(true);
      } catch (error) {
        console.error("Payment confirmation failed:", error);
      } finally {
        setLoading(false);
      }
    }

    confirmPayment();
  }, [projectId]);

  if (loading) {
    return <PaymentSkeleton />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        {confirmed ? (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-3">
              Payment Successful 🎉
            </h1>

            <p className="text-gray-600 mb-6">
              Your payment has been confirmed successfully.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-500 mb-3">
              Payment Confirmation Failed
            </h1>

            <p className="text-gray-600 mb-6">
              Please contact support or try again.
            </p>
          </>
        )}

        <Link
          href="/dashboard/projects"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Back to Projects
        </Link>
      </div>
    </div>
  );
}

function PaymentSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>

        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>

        <div className="h-10 bg-gray-200 rounded w-32 mx-auto"></div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSkeleton />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
