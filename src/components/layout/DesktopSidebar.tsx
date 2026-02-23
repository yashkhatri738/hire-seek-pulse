import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, FileText, User, Briefcase, Users, PlusCircle, Settings, BarChart3, MessageSquare, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const applicantLinks = [
  { to: "/applicant/dashboard", icon: Home, label: "Dashboard" },
  { to: "/applicant/jobs", icon: Search, label: "Find Jobs" },
  { to: "/applicant/applications", icon: FileText, label: "My Applications" },
  { to: "/applicant/profile", icon: User, label: "Profile" },
];

const employerLinks = [
  { to: "/employer/dashboard", icon: Home, label: "Dashboard" },
  { to: "/employer/post-job", icon: PlusCircle, label: "Post Job" },
  { to: "/employer/my-jobs", icon: Briefcase, label: "My Jobs" },
  { to: "/employer/candidates", icon: Users, label: "Candidates" },
  { to: "/employer/settings", icon: Settings, label: "Settings" },
];

export function DesktopSidebar({ role }: { role: "applicant" | "employer" }) {
  const location = useLocation();
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
          const isActive = location.pathname.startsWith(link.to);
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                isActive
                  ? "gradient-primary text-primary-foreground card-shadow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
