"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400 opacity-20 blur-3xl rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            Find the Right{" "}
            <span className="text-yellow-300">Automation & AI Experts</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-xl mx-auto md:mx-0">
            Connect with skilled automation engineers who can build workflows
            between tools like Google Sheets, Gmail, Slack, and CRM systems to
            save time and scale your business.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Link
              href="/experts"
              className="bg-white text-blue-600 px-7 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg text-center"
            >
              Find Experts
            </Link>

            <Link
              href="/register"
              className="border border-white px-7 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition text-center"
            >
              Post Automation Request
            </Link>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-md md:max-w-lg">
            <Image
              src="/automation-workflow.png"
              alt="Automation workflow connecting apps"
              width={600}
              height={450}
              className="rounded-2xl shadow-2xl object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
