"use client";

import { useState, useEffect } from "react";
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
  Bell,
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
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"business" | "expert" | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

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

  // ================= MENUS =================

  const expertMenu = [
    {
      name: "Dashboard",
      path: "/dashboard/expert",
      icon: LayoutDashboard,
      mobile: true,
    },
    {
      name: "My Projects",
      path: "/dashboard/my-projects",
      icon: ClipboardList,
      mobile: true,
    },
    {
      name: "Projects",
      path: "/dashboard/projects",
      icon: Folder,
      mobile: true,
    },
    {
      name: "Chats",
      path: "/dashboard/chats",
      icon: MessageSquare,
      mobile: true,
    },
    {
      name: "Notifications",
      path: "/dashboard/notifications",
      icon: Bell,
      mobile: false,
    },
  ];

  const businessMenu = [
    {
      name: "Dashboard",
      path: "/dashboard/business",
      icon: LayoutDashboard,
      mobile: true,
    },
    { name: "Search Experts", path: "/experts", icon: Search, mobile: true },
    {
      name: "Post Project",
      path: "/dashboard/projects/create",
      icon: FolderPlus,
      mobile: true,
    },
    {
      name: "Chats",
      path: "/dashboard/chats",
      icon: MessageSquare,
      mobile: true,
    },
    {
      name: "Notifications",
      path: "/dashboard/notifications",
      icon: Bell,
      mobile: false,
    },
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

      <aside className="hidden md:flex h-full flex-col">
        {/* Header */}

        <div
          className={`p-5 flex items-center ${isOpen ? "justify-around" : "justify-center"}`}
        >
          <Link href="/dashboard">
            {isOpen && (
              <span className="text-lg font-semibold text-gray-800">
                SearchMyExpert
              </span>
            )}
          </Link>

          <button onClick={onToggle}>
            {isOpen ? <PanelRightOpen size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}

        <nav className="flex-grow px-3 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex w-full items-center px-3 py-2.5 rounded-lg transition
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

        <div className="p-4 border-t border-gray-200 relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center w-full gap-3 p-2 rounded-lg hover:bg-gray-100
            ${!isOpen && "justify-center"}`}
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {user?.avatar ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_API}${user.avatar}`}
                  className="w-full h-full object-cover rounded-full"
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

      {/* ================= MOBILE BOTTOM NAV ================= */}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2">
          {menuItems
            .filter((item) => item.mobile !== false)
            .map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className="flex flex-col items-center gap-1 text-xs"
                >
                  <Icon
                    size={22}
                    className={
                      isActive(item.path) ? "text-blue-600" : "text-gray-500"
                    }
                  />
                  <span
                    className={
                      isActive(item.path) ? "text-blue-600" : "text-gray-500"
                    }
                  >
                    {item.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}

          {/* Profile */}
          <button
            onClick={() => router.push("/settings")}
            className="flex flex-col items-center gap-1 text-xs"
          >
            {user ? (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User size={22} className="text-gray-500" />
            )}
            <span className="text-gray-500">Profile</span>
          </button>
        </div>
      </div>
    </>
  );
}
