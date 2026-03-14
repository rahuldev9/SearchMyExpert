"use client";

import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment was not completed. You can try again whenever you're
          ready.
        </p>

        <Link
          href="/dashboard"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}
