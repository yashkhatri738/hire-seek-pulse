"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { JobCard } from "@/components/JobCard";
import { mockJobs } from "@/data/mockData";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function ApplicantDashboard() {
  const [search, setSearch] = useState("");
  const filtered = mockJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="applicant" title="Find Jobs">
      <div className="max-w-2xl mx-auto">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 pr-12 h-12 rounded-2xl bg-card card-shadow border-0 text-sm"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-muted transition-colors">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Recommended */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recommended for you
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((job, i) => (
            <JobCard key={job.id} {...job} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>No jobs found matching &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
