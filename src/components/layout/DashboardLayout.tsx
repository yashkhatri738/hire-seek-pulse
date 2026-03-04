"use client";

import { ReactNode } from "react";
import { MobileNav } from "./MobileNav";
import { DesktopSidebar } from "./DesktopSidebar";
import Link from "next/link";
import { Bell } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "applicant" | "employer";
  title: string;
}

export function DashboardLayout({ children, role, title }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DesktopSidebar role={role} />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="glass-strong sticky top-0 z-40 border-b px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full gradient-primary" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>
      <MobileNav role={role} />
    </div>
  );
}
