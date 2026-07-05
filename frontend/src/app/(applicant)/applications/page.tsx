import React from "react";
import { getMyApplications } from "@/lib/action/applicant/application.action";
import { getCurrentUser } from "@/lib/action/auth.quires";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Search,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { statusStyle } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function ApplicantApplicationsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "applicant") {
    redirect("/login");
  }

  const applicationsRes = await getMyApplications();
  const applications = applicationsRes.data || [];

  const statusCounts = {
    applied: applications.filter((a) => a.application.status === "applied")
      .length,
    reviewing: applications.filter((a) => a.application.status === "reviewing")
      .length,
    shortlisted: applications.filter(
      (a) => a.application.status === "shortlisted",
    ).length,
    selected: applications.filter((a) => a.application.status === "selected")
      .length,
    rejected: applications.filter((a) => a.application.status === "rejected")
      .length,
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            My <span className="gradient-text">Applications</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your {applications.length} submitted applications.
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="h-10 rounded-xl border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500">
            <Search className="mr-2 h-4 w-4" /> Browse More Jobs
          </Button>
        </Link>
      </div>

      {/* Status Summary Cards */}
      {applications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Applied", count: statusCounts.applied, key: "applied" },
            {
              label: "Reviewing",
              count: statusCounts.reviewing,
              key: "reviewing",
            },
            {
              label: "Shortlisted",
              count: statusCounts.shortlisted,
              key: "shortlisted",
            },
            {
              label: "Selected",
              count: statusCounts.selected,
              key: "selected",
            },
            {
              label: "Rejected",
              count: statusCounts.rejected,
              key: "rejected",
            },
          ].map((item) => (
            <div key={item.label} className="stat-card p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusStyle(item.key).dot}`}
                />
                <p className="text-2xl font-bold text-white">{item.count}</p>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {applications.length === 0 ? (
        <Card className="border border-dashed border-white/[0.12] bg-white/[0.02] backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-violet-300" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              No Applications Yet
            </h2>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              You haven&apos;t applied to any jobs yet. Start exploring and take
              the next step in your career!
            </p>
            <Link href="/dashboard">
              <Button className="rounded-xl border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500">
                Find Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((item, index) => {
            const s = statusStyle(item.application.status);
            return (
              <Card
                key={index}
                className="glass-card overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex gap-3">
                          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-600/25 to-pink-600/20 ring-1 ring-white/[0.08] flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-violet-300" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-white transition-colors group-hover:text-violet-300">
                              <Link href={`/jobs/${item.job?.id}`}>
                                {item.job?.title}
                              </Link>
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5 text-sm text-muted-foreground">
                              <span className="font-medium">
                                {item.employer?.name || "Anonymous Company"}
                              </span>
                              <span className="hidden sm:inline">·</span>
                              <span className="hidden sm:flex items-center gap-1">
                                <MapPin className="h-3 w-3" />{" "}
                                {item.job?.location || "Remote"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.badge}`}
                        >
                          {s.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1">
                          <Briefcase className="h-3 w-3" />
                          <span className="capitalize">
                            {item.job?.jobType?.replace("-", " ")}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1">
                          <Calendar className="h-3 w-3" />
                          Applied{" "}
                          {format(
                            new Date(item.application.appliedAt),
                            "MMM d, yyyy",
                          )}
                        </span>
                      </div>
                    </div>

                    <Separator
                      orientation="vertical"
                      className="hidden md:block bg-white/[0.06]"
                    />
                    <Separator className="md:hidden bg-white/[0.06]" />

                    <div className="bg-white/[0.02] p-5 md:w-56 flex flex-col justify-center gap-3">
                      <div className="space-y-2">
                        <a
                          href={item.application.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between text-sm transition-colors hover:text-violet-300 group/link"
                        >
                          <span className="text-muted-foreground">Resume</span>
                          <span className="flex items-center gap-1 font-medium text-violet-300">
                            View <ExternalLink className="h-3 w-3" />
                          </span>
                        </a>
                        {item.application.coverLetter && (
                          <div className="text-sm flex justify-between">
                            <span className="text-muted-foreground">
                              Cover Letter
                            </span>
                            <span className="font-medium text-emerald-300">
                              Included
                            </span>
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/chat?receiverId=${item.employer?.id}`}
                        className="mt-2"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-lg text-xs h-8 border-white/10 bg-transparent hover:bg-white/[0.05]"
                        >
                          <MessageSquare className="mr-1.5 h-3 w-3" /> Message
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
