"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Briefcase, CheckCircle, Archive, Users, UserCheck, Calendar, PlusCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { mockCandidates } from "@/data/mockData";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Briefcase, label: "Total Jobs", value: 12, trend: "+3" },
  { icon: CheckCircle, label: "Active Jobs", value: 8, trend: "+2" },
  { icon: Archive, label: "Archived", value: 4 },
  { icon: Users, label: "Applicants", value: 156, trend: "+24" },
  { icon: UserCheck, label: "Selected", value: 23, trend: "+5" },
  { icon: Calendar, label: "Interviews", value: 7, trend: "+3" },
];

const quickActions = [
  { icon: PlusCircle, label: "Post Job", to: "/employer/post-job", primary: true },
  { icon: Users, label: "Candidates", to: "/employer/candidates" },
  { icon: Briefcase, label: "My Jobs", to: "/employer/my-jobs" },
];

const statusColors: Record<string, string> = {
  New: "bg-primary/10 text-primary",
  Interview: "bg-warning/10 text-warning",
  Selected: "bg-success/10 text-success",
  Pending: "bg-muted text-muted-foreground",
};

export default function EmployerDashboard() {
  return (
    <DashboardLayout role="employer" title="Dashboard">
      <div className="max-w-4xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.to}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                  action.primary
                    ? "gradient-primary text-primary-foreground hero-shadow"
                    : "bg-card card-shadow text-foreground hover:card-shadow-hover"
                )}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </motion.button>
            </Link>
          ))}
        </div>

        {/* Recent Applications */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recent Applications
          </h2>
          <div className="flex flex-col gap-2">
            {mockCandidates.slice(0, 4).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.appliedFor}</p>
                </div>
                <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", statusColors[c.status])}>
                  {c.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
