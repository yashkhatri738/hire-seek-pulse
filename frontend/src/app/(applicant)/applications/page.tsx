import React from "react";
import { getMyApplications } from "@/lib/action/applicant/application.action";
import { getCurrentUser } from "@/lib/action/auth.quires";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Search,
  ArrowUpRight,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ApplicantApplicationsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "applicant") {
    redirect("/login");
  }

  const applicationsRes = await getMyApplications();
  const applications = applicationsRes.data || [];

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "applied":
        return "bg-blue-500/10 text-blue-600 ring-blue-500/20";
      case "reviewing":
        return "bg-amber-500/10 text-amber-600 ring-amber-500/20";
      case "shortlisted":
        return "bg-violet-500/10 text-violet-600 ring-violet-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-600 ring-red-500/20";
      case "selected":
        return "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your {applications.length} submitted applications.
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="gradient-primary text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-shadow h-10">
            <Search className="mr-2 h-4 w-4" /> Browse More Jobs
          </Button>
        </Link>
      </div>

      {/* Status Summary Cards */}
      {applications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            {
              label: "Applied",
              count: statusCounts.applied,
              color: "bg-blue-500",
            },
            {
              label: "Reviewing",
              count: statusCounts.reviewing,
              color: "bg-amber-500",
            },
            {
              label: "Shortlisted",
              count: statusCounts.shortlisted,
              color: "bg-violet-500",
            },
            {
              label: "Selected",
              count: statusCounts.selected,
              color: "bg-emerald-500",
            },
            {
              label: "Rejected",
              count: statusCounts.rejected,
              color: "bg-red-500",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="relative overflow-hidden rounded-xl bg-card border card-shadow p-4 text-center"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${item.color}`}
              />
              <p className="text-2xl font-bold mt-1">{item.count}</p>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {applications.length === 0 ? (
        <Card className="border-dashed border-2 card-shadow">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">No Applications Yet</h2>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              You haven&apos;t applied to any jobs yet. Start exploring and take
              the next step in your career!
            </p>
            <Link href="/dashboard">
              <Button className="gradient-primary text-white border-0 rounded-xl shadow-lg">
                Find Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden border-0 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex gap-3">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-950 dark:to-pink-950 flex items-center justify-center shrink-0">
                          <Building2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
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
                      <Badge
                        className={`capitalize border-0 text-[11px] ring-1 shrink-0 ${getStatusColor(item.application.status)}`}
                      >
                        {item.application.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-lg">
                        <Briefcase className="h-3 w-3" />
                        <span className="capitalize">
                          {item.job?.jobType?.replace("-", " ")}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-lg">
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
                    className="hidden md:block"
                  />
                  <Separator className="md:hidden" />

                  <div className="bg-muted/20 p-5 md:w-56 flex flex-col justify-center gap-3">
                    <div className="space-y-2">
                      <a
                        href={item.application.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between text-sm hover:text-primary transition-colors group/link"
                      >
                        <span className="text-muted-foreground">Resume</span>
                        <span className="flex items-center gap-1 font-medium text-primary">
                          View <ExternalLink className="h-3 w-3" />
                        </span>
                      </a>
                      {item.application.coverLetter && (
                        <div className="text-sm flex justify-between">
                          <span className="text-muted-foreground">
                            Cover Letter
                          </span>
                          <span className="font-medium text-emerald-600">
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
                        className="w-full rounded-lg text-xs h-8"
                      >
                        <MessageSquare className="mr-1.5 h-3 w-3" /> Message
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
