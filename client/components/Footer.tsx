"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Column 1 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">Company</h3>

          <ul className="space-y-3">
            <li>
              <motion.div whileHover={{ x: 4 }}>
                <Link href="/about" className="hover:text-blue-400 transition">
                  About Us
                </Link>
              </motion.div>
            </li>

            <li>
              <motion.div whileHover={{ x: 4 }}>
                <Link
                  href="/how-it-works"
                  className="hover:text-blue-400 transition"
                >
                  How It Works
                </Link>
              </motion.div>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">
            For Businesses
          </h3>

          <ul className="space-y-3">
            <li>
              <motion.div whileHover={{ x: 4 }}>
                <Link
                  href="/experts"
                  className="hover:text-blue-400 transition"
                >
                  Find Experts
                </Link>
              </motion.div>
            </li>

            <li>
              <motion.div whileHover={{ x: 4 }}>
                <Link
                  href="/post-request"
                  className="hover:text-blue-400 transition"
                >
                  Post Request
                </Link>
              </motion.div>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">For Experts</h3>

          <ul className="space-y-3">
            <li>
              <motion.div whileHover={{ x: 4 }}>
                <Link
                  href="/become-expert"
                  className="hover:text-blue-400 transition"
                >
                  Become an Expert
                </Link>
              </motion.div>
            </li>

            <li>
              <motion.div whileHover={{ x: 4 }}>
                <Link
                  href="/expert-guidelines"
                  className="hover:text-blue-400 transition"
                >
                  Expert Guidelines
                </Link>
              </motion.div>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">Support</h3>

          <ul className="space-y-3">
            <li>
              <motion.div whileHover={{ x: 4 }}>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition"
                >
                  Contact
                </Link>
              </motion.div>
            </li>

            <li>
              <motion.div whileHover={{ x: 4 }}>
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition"
                >
                  Privacy Policy
                </Link>
              </motion.div>
            </li>

            <li>
              <motion.div whileHover={{ x: 4 }}>
                <Link href="/terms" className="hover:text-blue-400 transition">
                  Terms of Service
                </Link>
              </motion.div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} SearchMyExpert. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <Link
              href="https://linkedin.com"
              className="hover:text-blue-400 transition"
            >
              LinkedIn
            </Link>

            <Link
              href="https://twitter.com"
              className="hover:text-blue-400 transition"
            >
              Twitter
            </Link>

            <Link
              href="https://github.com"
              className="hover:text-blue-400 transition"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
