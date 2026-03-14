"use client";

import { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

interface DashboardLayoutProps {
  children?: ReactNode;
  activePage?: string;
  autoClose?: boolean;
  showSidebar?: boolean;
  onSidebarOpen?: (isOpen: boolean) => void;
}

export default function DashboardLayout({
  children,
  activePage,
  autoClose,
  onSidebarOpen,
  showSidebar = true,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Notify parent when sidebar changes
  useEffect(() => {
    onSidebarOpen?.(sidebarOpen);
  }, [sidebarOpen, onSidebarOpen]);

  // Auto close if required
  useEffect(() => {
    if (autoClose) {
      setSidebarOpen(false);
    }
  }, [autoClose]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      {showSidebar && (
        <div
          className={`hidden md:flex flex-col h-full border-r border-slate-200 bg-white transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((prev) => !prev)}
            // activePage={activePage}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="md:hidden">
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((prev) => !prev)}
            // activePage={activePage}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto pb-12 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
