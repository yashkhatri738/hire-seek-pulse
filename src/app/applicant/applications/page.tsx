"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockApplications } from "@/data/mockData";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Interview: "bg-primary/10 text-primary",
  Rejected: "bg-destructive/10 text-destructive",
  Selected: "bg-success/10 text-success",
};

export default function Applications() {
  return (
    <DashboardLayout role="applicant" title="My Applications">
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {mockApplications.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="bg-card rounded-2xl p-4 card-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {app.company.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{app.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground">{app.company}</p>
                </div>
              </div>
              <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", statusColors[app.status])}>
                {app.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Applied {app.appliedDate}</p>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
