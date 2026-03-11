"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type Props = {
  name?: string;
  role?: string;
};

export default function Sidebar({ name = "User" }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string | undefined>();

  useEffect(() => {
    const cookieRole = Cookies.get("role");
    setRole(cookieRole);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-start justify-between p-4 bg-blue-900 text-white sticky top-0 z-40">
        <button onClick={() => setOpen(true)} className="text-xl">
          ☰
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white w-64 p-6 flex flex-col justify-between
        fixed md:static h-screen z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        overflow-y-auto`}
      >
        <div>
          {/* Mobile Close */}
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="font-semibold text-lg">Menu</h2>

            <button
              onClick={() => setOpen(false)}
              className="text-xl hover:text-red-400"
            >
              ✕
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              {name.charAt(0)}
            </div>

            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-xs text-gray-400">{role}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-4">
            <Link
              href="/"
              className="block hover:text-blue-400 transition"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>

            {/* Business Menu */}
            {role === "business" && (
              <Link
                href="/dashboard/business/requests"
                className="block hover:text-blue-400 transition"
                onClick={() => setOpen(false)}
              >
                My Requests
              </Link>
            )}

            {/* Expert Menu */}
            {role === "expert" && (
              <Link
                href="/dashboard/expert/applied"
                className="block hover:text-blue-400 transition"
                onClick={() => setOpen(false)}
              >
                My Applied Jobs
              </Link>
            )}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded mt-6"
        >
          Logout
        </button>
      </aside>
    </>
  );
}
