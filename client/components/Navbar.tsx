"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";

export default function Navbar() {
  const [token, setToken] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Load token + role from cookies
  useEffect(() => {
    const savedToken = Cookies.get("token");
    const savedRole = Cookies.get("role");

    setToken(savedToken);
    setRole(savedRole);
  }, []);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    setToken(undefined);
    setRole(undefined);
    router.push("/login");
  };

  const dashboardLink =
    role === "business" ? "/dashboard/business" : "/dashboard/expert";

  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/experts"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Find Experts
          </Link>

          {token && !isDashboardPage ? (
            <>
              <Link
                href={dashboardLink}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>

              {/* <button
                onClick={logout}
                className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Logout
              </button> */}
            </>
          ) : !token ? (
            <>
              <Link
                href="/login"
                className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-700"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white">
          <div className="flex flex-col px-6 py-4 gap-4">
            <Link href="/experts" className="text-gray-700">
              Find Experts
            </Link>

            {token && !isDashboardPage ? (
              <>
                <Link
                  href={dashboardLink}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
                >
                  Dashboard
                </Link>

                {/* <button
                  onClick={logout}
                  className="border px-4 py-2 rounded-lg"
                >
                  Logout
                </button> */}
              </>
            ) : !token ? (
              <>
                <Link
                  href="/login"
                  className="border px-4 py-2 rounded-lg text-center"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
