"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockJobs, mockCandidates } from "@/data/mockData";
import { ArrowLeft, Edit, Archive, XCircle, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  New: "bg-primary/10 text-primary",
  Interview: "bg-warning/10 text-warning",
  Selected: "bg-success/10 text-success",
  Pending: "bg-muted text-muted-foreground",
};

export default function JobDetailEmployer() {
  const { id } = useParams<{ id: string }>();
  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    return (
      <DashboardLayout role="employer" title="Not Found">
        <p className="text-muted-foreground text-center py-16">Job not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employer" title={job.title}>
      <div className="max-w-2xl mx-auto">
        <Link href="/employer/my-jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" className="rounded-xl"><Edit className="h-3 w-3 mr-1" /> Edit</Button>
          <Button variant="outline" size="sm" className="rounded-xl"><Archive className="h-3 w-3 mr-1" /> Archive</Button>
          <Button variant="outline" size="sm" className="rounded-xl text-destructive"><XCircle className="h-3 w-3 mr-1" /> Close</Button>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full rounded-xl bg-muted mb-4">
            <TabsTrigger value="details" className="flex-1 rounded-lg">Details</TabsTrigger>
            <TabsTrigger value="candidates" className="flex-1 rounded-lg">Candidates</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl p-6 card-shadow">
              <h2 className="text-lg font-bold text-foreground">{job.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{job.location} · {job.salary} · {job.type}</p>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{job.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {job.skills.map((s) => (
                  <span key={s} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="candidates">
            <div className="flex flex-col gap-2">
              {mockCandidates.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-2xl p-4 card-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">{c.avatar}</div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.experience} experience</p>
                    </div>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", statusColors[c.status])}>{c.status}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="rounded-lg text-xs h-8"><CheckCircle className="h-3 w-3 mr-1" /> Approve</Button>
                    <Button size="sm" variant="outline" className="rounded-lg text-xs h-8"><Calendar className="h-3 w-3 mr-1" /> Interview</Button>
                    <Button size="sm" variant="outline" className="rounded-lg text-xs h-8 text-destructive"><XCircle className="h-3 w-3 mr-1" /> Reject</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
