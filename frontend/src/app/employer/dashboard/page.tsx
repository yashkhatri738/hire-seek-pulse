import React from "react";
import { getJobsByEmployer } from "@/lib/action/employer/job.action";
import { getEmployerReceivedApplications } from "@/lib/action/employer/application.action";
import { getEmployerDetails } from "@/lib/action/employer/employer.action";
import { getMyConversations } from "@/lib/action/chat.action";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { statusStyle } from "@/lib/ui";

export const dynamic = "force-dynamic";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { format } from "date-fns";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Plus,
  MessageSquare,
  Clock,
  MapPin,
  Eye,
  Building2,
  Sparkles,
  Zap,
  ChevronRight,
  CalendarDays,
  Star,
} from "lucide-react";

export default async function EmployerDashboard() {
  const [jobs, applicationsRes, employerRes, conversationsRes] =
    await Promise.all([
      getJobsByEmployer(),
      getEmployerReceivedApplications(),
      getEmployerDetails(),
      getMyConversations(),
    ]);

  const applications = applicationsRes.data || [];
  const conversations = conversationsRes.data || [];
  const employer = employerRes.status === "SUCCESS" ? employerRes.data : null;

  const totalJobs = jobs.length;
  const totalApplications = applications.length;
  const activeJobs = jobs.filter(
    ({ job }) =>
      !job.deletedAt &&
      (!job.expiresAt || new Date(job.expiresAt) > new Date()),
  ).length;
  const shortlisted = applications.filter(
    (a) => a.application.status === "shortlisted",
  ).length;
  const newApplications = applications.filter(
    (a) => a.application.status === "applied",
  ).length;

  const stats = [
    {
      label: "Total Jobs",
      value: totalJobs,
      icon: Briefcase,
      tile: "bg-violet-500/10 text-violet-300 border border-violet-500/20",
      change: `${activeJobs} active`,
      href: "/employer/application",
    },
    {
      label: "Applications",
      value: totalApplications,
      icon: FileText,
      tile: "bg-pink-500/10 text-pink-300 border border-pink-500/20",
      change: `${newApplications} new`,
      href: "/employer/candidates",
    },
    {
      label: "Shortlisted",
      value: shortlisted,
      icon: Star,
      tile: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
      change: "candidates",
      href: "/employer/candidates",
    },
    {
      label: "Messages",
      value: conversations.length,
      icon: MessageSquare,
      tile: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
      change: "conversations",
      href: "/employer/chat",
    },
  ];

  return (
    <div className="max-w-[1300px] mx-auto space-y-8 animate-fade-up">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-muted-foreground">
              {format(new Date(), "EEEE, MMMM d")}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back,{" "}
            <span className="gradient-text">
              {employer?.name || "Employer"}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your job listings today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-white/10 bg-transparent hover:bg-white/[0.05]"
            asChild
          >
            <Link href="/employer/candidates">
              <Users className="mr-2 h-4 w-4" /> View Candidates
            </Link>
          </Button>
          <Button
            className="h-10 rounded-xl border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500"
            asChild
          >
            <Link href="/employer/postjob">
              <Plus className="mr-2 h-4 w-4" /> Post New Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="stat-card group cursor-pointer h-full border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div
                      className={`h-11 w-11 rounded-xl ${stat.tile} flex items-center justify-center`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold tracking-tight text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <span className="text-xs font-medium text-violet-300">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications - spans 2 cols */}
        <Card className="lg:col-span-2 overflow-hidden border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <div className="h-8 w-8 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20 flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  Recent Applications
                </CardTitle>
                <CardDescription className="mt-1">
                  Latest candidates who applied to your jobs
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground rounded-lg hover:bg-white/[0.05] hover:text-foreground"
                asChild
              >
                <Link href="/employer/candidates">
                  View All <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            {applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="h-14 w-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-white">No applications yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Post a job to start receiving applications
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {applications.slice(0, 6).map((item, index) => {
                  const st = statusStyle(item.application.status);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors"
                    >
                      <Avatar className="h-10 w-10 border border-white/[0.08]">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500/20 to-pink-500/20 text-sm font-semibold text-violet-200">
                          {item.application.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-white">
                          {item.application.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Applied for {item.job?.title || "Unknown Position"}
                        </p>
                      </div>
                      <Badge
                        className={`border-0 text-[11px] ${st.badge}`}
                      >
                        {st.label}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap hidden sm:block">
                        {format(new Date(item.application.appliedAt), "MMM d")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions + Recent Jobs */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="overflow-hidden border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <Separator className="bg-white/[0.06]" />
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Post Job",
                    icon: Plus,
                    href: "/employer/postjob",
                    color: "text-violet-300 bg-violet-500/10 border border-violet-500/20",
                  },
                  {
                    label: "Candidates",
                    icon: Users,
                    href: "/employer/candidates",
                    color: "text-pink-300 bg-pink-500/10 border border-pink-500/20",
                  },
                  {
                    label: "Messages",
                    icon: MessageSquare,
                    href: "/employer/chat",
                    color: "text-sky-300 bg-sky-500/10 border border-sky-500/20",
                  },
                  {
                    label: "Settings",
                    icon: Building2,
                    href: "/employer/profile",
                    color: "text-amber-300 bg-amber-500/10 border border-amber-500/20",
                  },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.label} href={action.href}>
                      <div
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all cursor-pointer hover:-translate-y-0.5 ${action.color}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium">
                          {action.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Jobs */}
          <Card className="overflow-hidden border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center justify-center">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  Your Jobs
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground rounded-lg hover:bg-white/[0.05] hover:text-foreground"
                  asChild
                >
                  <Link href="/employer/application">
                    All <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <Separator className="bg-white/[0.06]" />
            <CardContent className="p-0">
              {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-6">
                  <p className="text-sm text-muted-foreground">
                    No jobs posted yet
                  </p>
                  <Button variant="link" size="sm" className="mt-1 text-violet-300" asChild>
                    <Link href="/employer/postjob">Post your first job</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06]">
                  {jobs.slice(0, 4).map(({ job }) => (
                    <Link
                      key={job.id}
                      href={`/employer/application/${job.id}`}
                      className="block hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="px-5 py-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold truncate text-white">
                            {job.title}
                          </p>
                          {job.isFeatured && (
                            <Badge className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] shrink-0">
                              <Sparkles className="h-3 w-3 mr-0.5" /> Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{" "}
                            {job.location || "Remote"}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {job.jobType}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Status Overview */}
      {applications.length > 0 && (
        <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
              Application Pipeline
            </CardTitle>
            <CardDescription>
              Overview of all candidate statuses across your jobs
            </CardDescription>
          </CardHeader>
          <Separator className="bg-white/[0.06]" />
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {(
                [
                  "applied",
                  "reviewing",
                  "shortlisted",
                  "selected",
                  "rejected",
                ] as const
              ).map((status) => {
                const st = statusStyle(status);
                const count = applications.filter(
                  (a) => a.application.status === status,
                ).length;
                return (
                  <div
                    key={status}
                    className="relative overflow-hidden rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center transition-colors hover:bg-white/[0.05]"
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 ${st.dot}`}
                    />
                    <p className="text-2xl font-bold mt-1 text-white">{count}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      {st.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
