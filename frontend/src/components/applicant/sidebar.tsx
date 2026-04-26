"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  User,
  LogOut,
  ChevronRight,
  Sparkles,
  Search,
  Briefcase,
} from "lucide-react";
import { LogoutAction } from "@/lib/action/auth.action";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const sidebarLinks = [
  {
    href: "/dashboard",
    label: "Browse Jobs",
    icon: Search,
    color: "text-violet-500",
  },
  {
    href: "/applications",
    label: "My Applications",
    icon: FileText,
    color: "text-pink-500",
  },
  {
    href: "/chat",
    label: "Messages",
    icon: MessageSquare,
    color: "text-sky-500",
  },
  { href: "/profile", label: "Profile", icon: User, color: "text-emerald-500" },
];

const ApplicantSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-card/95 backdrop-blur-xl flex flex-col z-40 sidebar-shadow border-r border-border/60">
      {/* Logo */}
      <div className="h-[70px] flex items-center px-6 gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg glow-sm">
          <Briefcase className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold gradient-text tracking-tight">
            HireNest
          </span>
          <p className="text-[10px] text-muted-foreground font-medium -mt-0.5">
            Job Seeker
          </p>
        </div>
      </div>

      <Separator className="opacity-60" />

      {/* Nav Links */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] px-3 mb-3">
          Navigation
        </div>
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" &&
              pathname.startsWith(link.href + "/"));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-[13px] font-medium relative ${
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
              )}
              <div
                className={`flex items-center justify-center h-8 w-8 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/15"
                    : "bg-muted/60 group-hover:bg-muted"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${isActive ? "text-primary" : link.color + " opacity-70 group-hover:opacity-100"}`}
                />
              </div>
              <span className="flex-1">{link.label}</span>
              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 text-primary/60" />
              )}
            </Link>
          );
        })}
      </div>

      <Separator className="opacity-60" />

      {/* Logout */}
      <div className="p-3">
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/8 h-10 px-3 rounded-xl transition-all duration-200 text-[13px] font-medium gap-3"
          onClick={() => LogoutAction()}
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted/60">
            <LogOut className="h-[18px] w-[18px]" />
          </div>
          Log out
        </Button>
      </div>
    </aside>
  );
};

export default ApplicantSidebar;
