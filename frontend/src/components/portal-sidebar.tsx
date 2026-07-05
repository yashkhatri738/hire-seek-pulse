"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LogOut, Sparkles } from "lucide-react";
import { LogoutAction } from "@/lib/action/auth.action";
import {
  applicantLinks,
  employerLinks,
  isLinkActive,
  type NavLink,
} from "@/components/nav-config";

function NavItems({
  links,
  onNavigate,
}: {
  links: NavLink[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <div className="flex-1 space-y-1 overflow-y-auto px-3 py-5 scrollbar-hide">
      <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        Navigation
      </div>
      {links.map((link) => {
        const isDashboard = link.href.endsWith("/dashboard");
        const isActive = isLinkActive(pathname, link.href, isDashboard);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
              isActive
                ? "bg-primary/10 text-white ring-1 ring-primary/25"
                : "text-muted-foreground hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-violet-500 to-pink-500" />
            )}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/20"
                  : "bg-white/[0.04] group-hover:bg-white/[0.08]"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] ${
                  isActive
                    ? "text-primary"
                    : `${link.color} opacity-70 group-hover:opacity-100`
                }`}
              />
            </div>
            <span className="flex-1">{link.label}</span>
            {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary/70" />}
          </Link>
        );
      })}
    </div>
  );
}

function SidebarBrand({ subtitle }: { subtitle: string }) {
  return (
    <div className="flex h-[70px] items-center gap-3 px-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 shadow-lg glow-sm">
        <Sparkles className="h-[18px] w-[18px] text-white" />
      </div>
      <div>
        <span className="text-lg font-bold tracking-tight gradient-text">
          HireNest
        </span>
        <p className="-mt-0.5 text-[10px] font-medium text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function LogoutButton() {
  return (
    <div className="p-3">
      <form action={LogoutAction} className="w-full">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
            <LogOut className="h-[18px] w-[18px]" />
          </div>
          Log out
        </button>
      </form>
    </div>
  );
}

/** Desktop fixed rail (hidden on mobile — the drawer covers small screens). */
export function PortalSidebar({
  variant,
}: {
  variant: "applicant" | "employer";
}) {
  const links = variant === "employer" ? employerLinks : applicantLinks;
  const subtitle = variant === "employer" ? "Employer Portal" : "Job Seeker";
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-white/[0.06] bg-sidebar/70 backdrop-blur-xl sidebar-shadow lg:flex">
      <SidebarBrand subtitle={subtitle} />
      <div className="mx-3 h-px bg-white/[0.06]" />
      <NavItems links={links} />
      <div className="mx-3 h-px bg-white/[0.06]" />
      <LogoutButton />
    </aside>
  );
}

/** Contents reused inside the mobile Sheet drawer. */
export function SidebarContents({
  variant,
  onNavigate,
}: {
  variant: "applicant" | "employer";
  onNavigate?: () => void;
}) {
  const links = variant === "employer" ? employerLinks : applicantLinks;
  const subtitle = variant === "employer" ? "Employer Portal" : "Job Seeker";
  return (
    <div className="flex h-full flex-col">
      <SidebarBrand subtitle={subtitle} />
      <div className="mx-3 h-px bg-white/[0.06]" />
      <NavItems links={links} onNavigate={onNavigate} />
      <div className="mx-3 h-px bg-white/[0.06]" />
      <LogoutButton />
    </div>
  );
}

export default PortalSidebar;
