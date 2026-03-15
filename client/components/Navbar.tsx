"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

export default function Navbar() {
  const [token, setToken] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedToken = Cookies.get("token");
    const savedRole = Cookies.get("role");

    setToken(savedToken);
    setRole(savedRole);
    setLoading(false);

    if (savedToken && savedRole && pathname === "/login") {
      router.push(
        savedRole === "business" ? "/dashboard/business" : "/dashboard/expert",
      );
    }
  }, [pathname, router]);

  const dashboardLink =
    role === "business" ? "/dashboard/business" : "/dashboard/expert";

  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {loading && (
            <div className="w-28 h-10 rounded-xl bg-gray-200 animate-pulse"></div>
          )}

          {/* Always visible */}
          <Link href="/experts" className="hover:text-blue-600 transition">
            Experts
          </Link>

          <Link href="/business" className="hover:text-blue-600 transition">
            Business
          </Link>

          {/* Conditional buttons */}
          {!loading && role && !isDashboardPage ? (
            <Link
              href={dashboardLink}
              className="bg-blue-500 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-600 transition"
            >
              Dashboard
            </Link>
          ) : !loading && !token ? (
            <>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-blue-500 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-600 transition"
              >
                Sign Up
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
        >
          <span className="text-xl">☰</span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-none"
          >
            <div className="flex flex-col px-6 py-6 gap-4 font-medium">
              {loading && (
                <div className="w-full h-12 rounded-xl bg-gray-200 animate-pulse"></div>
              )}
              <Link href="/experts" className="hover:text-blue-600 transition">
                Experts
              </Link>

              <Link href="/business" className="hover:text-blue-600 transition">
                Business
              </Link>

              {!loading && role && !isDashboardPage ? (
                <Link
                  href={dashboardLink}
                  onClick={() => setMobileOpen(false)}
                  className="bg-blue-500 text-white px-4 py-3 rounded-xl text-center shadow hover:bg-blue-600 transition"
                >
                  Dashboard
                </Link>
              ) : !loading && !token ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="border border-gray-200 px-4 py-3 rounded-xl text-center hover:bg-gray-100 transition"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="bg-blue-500 text-white px-4 py-3 rounded-xl text-center shadow hover:bg-blue-600 transition"
                  >
                    Sign Up
                  </Link>
                </>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
