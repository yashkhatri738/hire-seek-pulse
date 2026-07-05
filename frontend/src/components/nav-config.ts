import {
  Search,
  FileText,
  MessageSquare,
  User,
  Briefcase,
  Users,
  FileUser,
  UserPen,
  ClipboardCheck,
  LayoutDashboardIcon,
  type LucideIcon,
} from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
};

export const applicantLinks: NavLink[] = [
  { href: "/dashboard", label: "Browse Jobs", icon: Search, color: "text-violet-400" },
  { href: "/applications", label: "My Applications", icon: FileText, color: "text-pink-400" },
  { href: "/chat", label: "Messages", icon: MessageSquare, color: "text-sky-400" },
  { href: "/profile", label: "Profile", icon: User, color: "text-emerald-400" },
];

export const employerLinks: NavLink[] = [
  { href: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboardIcon, color: "text-violet-400" },
  { href: "/employer/postjob", label: "Post Job", icon: Briefcase, color: "text-pink-400" },
  { href: "/employer/candidates", label: "Candidates", icon: Users, color: "text-emerald-400" },
  { href: "/employer/application", label: "My Jobs", icon: FileUser, color: "text-amber-400" },
  { href: "/employer/chat", label: "Messages", icon: MessageSquare, color: "text-sky-400" },
  { href: "/employer/profile", label: "Settings", icon: UserPen, color: "text-orange-400" },
  { href: "/employer/schedule-interview", label: "Interviews", icon: ClipboardCheck, color: "text-teal-400" },
];

/** Active-state matcher shared by the sidebar and the mobile drawer. */
export function isLinkActive(pathname: string, href: string, isDashboard: boolean) {
  if (isDashboard) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}
