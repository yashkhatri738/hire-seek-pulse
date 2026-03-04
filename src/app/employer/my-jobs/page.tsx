"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockJobs } from "@/data/mockData";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const jobStatuses = ["Active", "Active", "Closed", "Active", "Archived", "Active"];

export default function MyJobs() {
  return (
    <DashboardLayout role="employer" title="My Jobs">
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {mockJobs.map((job, i) => {
          const status = jobStatuses[i] || "Active";
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/employer/my-jobs/${job.id}`}
                className="block bg-card rounded-2xl p-4 card-shadow hover:card-shadow-hover transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.location}</p>
                  </div>
                  <span className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-full",
                    status === "Active" ? "bg-success/10 text-success" :
                    status === "Closed" ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {Math.floor(i * 7 + 5)} applicants</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.posted}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
