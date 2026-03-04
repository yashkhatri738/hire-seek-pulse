"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockCandidates } from "@/data/mockData";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusColors: Record<string, string> = {
  New: "bg-primary/10 text-primary",
  Interview: "bg-warning/10 text-warning",
  Selected: "bg-success/10 text-success",
  Pending: "bg-muted text-muted-foreground",
};

export default function Candidates() {
  return (
    <DashboardLayout role="employer" title="Candidates">
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {mockCandidates.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/employer/candidates/${c.id}`} className="block bg-card rounded-2xl p-4 card-shadow hover:card-shadow-hover transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {c.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.experience} · Applied for {c.appliedFor}</p>
                </div>
                <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", statusColors[c.status])}>
                  {c.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {c.skills.map((s) => (
                  <span key={s} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
