"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, FileText, User, Briefcase, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const applicantLinks = [
  { href: "/applicant/dashboard", icon: Home, label: "Home" },
  { href: "/applicant/jobs", icon: Search, label: "Jobs" },
  { href: "/applicant/applications", icon: FileText, label: "Applied" },
  { href: "/applicant/profile", icon: User, label: "Profile" },
];

const employerLinks = [
  { href: "/employer/dashboard", icon: Home, label: "Home" },
  { href: "/employer/my-jobs", icon: Briefcase, label: "Jobs" },
  { href: "/employer/candidates", icon: Users, label: "Candidates" },
  { href: "/employer/settings", icon: Settings, label: "Settings" },
];

export function MobileNav({ role }: { role: "applicant" | "employer" }) {
  const pathname = usePathname();
  const links = role === "applicant" ? applicantLinks : employerLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t md:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon className={cn("h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{link.label}</span>
              {isActive && (
                <div className="h-1 w-1 rounded-full gradient-primary mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
