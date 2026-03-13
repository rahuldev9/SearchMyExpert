"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Menu,
  PanelRightOpen,
  Settings,
  LogOut,
  User,
  Search,
  FolderPlus,
  Folder,
  MessageSquare,
  ClipboardList,
} from "lucide-react";

import API from "@/lib/api";
import { getUserProfile } from "@/contexts/AuthDetails";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: "business" | "expert";
}

interface SidebarProps {
  autoClose?: boolean;
  onToggle?: (isOpen: boolean, isMobile: boolean) => void;
}

export default function Sidebar({ onToggle, autoClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"business" | "expert" | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  const shouldAutoClose = autoClose !== undefined ? autoClose : isMobile;

  // ================= FETCH USER =================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        setRole(data.role ?? null);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  // ================= RESPONSIVE =================

  useEffect(() => {
    if (shouldAutoClose) {
      setIsOpen(false);
    }
  }, [pathname, shouldAutoClose]);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;

      setIsMobile(mobile);
      setIsOpen(!mobile);

      onToggle?.(!mobile, mobile);
    };

    check();

    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [onToggle]);

  // ================= MENUS =================

  const expertMenu = [
    {
      name: "Dashboard",
      path: "/dashboard/expert",
      icon: LayoutDashboard,
    },
    { name: "Requests", path: "/dashboard/my-projects", icon: ClipboardList },
    { name: "Projects", path: "/dashboard/projects", icon: Folder },
    { name: "Messages", path: "/dashboard/chats", icon: MessageSquare },
  ];

  const businessMenu = [
    { name: "Dashboard", path: "/dashboard/business", icon: LayoutDashboard },
    { name: "Search Experts", path: "/experts", icon: Search },
    {
      name: "Post Project",
      path: "/dashboard/projects/create",
      icon: FolderPlus,
    },
    // { name: "My Projects", path: "/dashboard/my-projects", icon: Folder },
    { name: "Messages", path: "/dashboard/chats", icon: MessageSquare },
  ];

  const menuItems = role === "business" ? businessMenu : expertMenu;

  // ================= LOGOUT =================

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside
        className={`hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex-col transition-all duration-300 z-40
        ${isOpen ? "w-64" : "w-20"}`}
      >
        {/* Header */}

        <div className="p-5 flex items-center justify-between">
          <Link href="/dashboard">
            {isOpen && (
              <span className="text-lg font-semibold text-gray-800">
                SearchMyExpert
              </span>
            )}
          </Link>

          {isOpen && (
            <button onClick={() => setIsOpen(false)}>
              <PanelRightOpen size={20} />
            </button>
          )}
        </div>

        {!isOpen && (
          <div className="flex justify-center pb-3">
            <button onClick={() => setIsOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        )}

        {/* Navigation */}

        <nav className="flex-grow px-3 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex items-center px-3 py-2.5 rounded-lg transition
                ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }
                ${isOpen ? "gap-3" : "justify-center"}`}
              >
                <Icon size={20} />
                {isOpen && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Profile */}

        <div className="p-4 border-t border-gray-200 relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center w-full gap-3 p-2 rounded-lg hover:bg-gray-100
            ${!isOpen && "justify-center"}`}
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {user?.avatar ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_API}${user.avatar}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>

            {isOpen && (
              <span className="text-sm font-medium">{user?.name}</span>
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute bottom-16 left-4 right-4 bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => router.push("/settings")}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm"
              >
                <Settings size={16} />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ================= MOBILE NAV ================= */}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button key={item.path} onClick={() => router.push(item.path)}>
                <Icon
                  size={26}
                  className={
                    isActive(item.path) ? "text-blue-600" : "text-gray-500"
                  }
                />
              </button>
            );
          })}

          <button onClick={() => router.push("/settings")}>
            {user ? (
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User size={26} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
