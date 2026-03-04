"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, FileText, User, Briefcase, Users, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const applicantLinks = [
  { href: "/applicant/dashboard", icon: Home, label: "Dashboard" },
  { href: "/applicant/jobs", icon: Search, label: "Find Jobs" },
  { href: "/applicant/applications", icon: FileText, label: "My Applications" },
  { href: "/applicant/profile", icon: User, label: "Profile" },
];

const employerLinks = [
  { href: "/employer/dashboard", icon: Home, label: "Dashboard" },
  { href: "/employer/post-job", icon: PlusCircle, label: "Post Job" },
  { href: "/employer/my-jobs", icon: Briefcase, label: "My Jobs" },
  { href: "/employer/candidates", icon: Users, label: "Candidates" },
  { href: "/employer/settings", icon: Settings, label: "Settings" },
];

export function DesktopSidebar({ role }: { role: "applicant" | "employer" }) {
  const pathname = usePathname();
  const links = role === "applicant" ? applicantLinks : employerLinks;

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold gradient-text">
          {role === "employer" ? "Employer Panel" : "Job Portal"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {role === "employer" ? "Manage your hiring" : "Find your dream job"}
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                isActive
                  ? "gradient-primary text-primary-foreground card-shadow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
