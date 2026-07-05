import React from "react";
import { getEmployerReceivedApplications } from "@/lib/action/employer/application.action";
import { getCurrentUser } from "@/lib/action/auth.quires";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { statusStyle } from "@/lib/ui";

export const dynamic = "force-dynamic";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  Video,
  MessageSquare,
  Briefcase,
  Mail,
  Clock,
} from "lucide-react";

export default async function ScheduleInterviewPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "employer") {
    redirect("/login");
  }

  const applicationsRes = await getEmployerReceivedApplications();
  const applications = applicationsRes.data || [];
  const shortlisted = applications.filter(
    (a) =>
      a.application.status === "shortlisted" ||
      a.application.status === "reviewing",
  );
  const shortlistedCount = applications.filter(
    (a) => a.application.status === "shortlisted",
  ).length;
  const awaitingReview = applications.filter(
    (a) => a.application.status === "applied",
  ).length;

  return (
    <div className="max-w-[1100px] mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            <span className="gradient-text">Interviews</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage interviews with shortlisted candidates.
          </p>
        </div>
        <Button
          className="rounded-xl h-10 border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500"
          asChild
        >
          <Link href="/employer/candidates">
            <Users className="mr-2 h-4 w-4" /> View All Candidates
          </Link>
        </Button>
      </div>

      {/* Info Cards — honest metrics derived from loaded applications */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="stat-card border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {shortlisted.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Ready to Interview
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center justify-center">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{shortlistedCount}</p>
              <p className="text-sm text-muted-foreground">Shortlisted</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{awaitingReview}</p>
              <p className="text-sm text-muted-foreground">Awaiting Review</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Ready for Interview */}
      <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                Shortlisted Candidates
              </CardTitle>
              <CardDescription className="mt-1">
                These candidates are ready for interview scheduling
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator className="bg-white/[0.06]" />
        <CardContent className="p-0">
          {shortlisted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="h-14 w-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-3">
                <CalendarDays className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-white">No Candidates to Interview</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Shortlist candidates from your applications to start scheduling
                interviews.
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-xl border-white/10 bg-transparent hover:bg-white/[0.05]"
                asChild
              >
                <Link href="/employer/candidates">Review Candidates</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {shortlisted.map((item, index) => {
                const st = statusStyle(item.application.status);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors group"
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
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Briefcase className="h-3 w-3" />
                        <span className="truncate">
                          {item.job?.title || "Position"}
                        </span>
                      </div>
                    </div>
                    <Badge className={`border-0 text-[11px] ${st.badge}`}>
                      {st.label}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                        asChild
                      >
                        <Link
                          href={`/employer/chat?receiverId=${item.userAccount?.id}`}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                        asChild
                      >
                        <a href={`mailto:${item.application.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coming Soon Feature Notice */}
      <Card className="relative overflow-hidden border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-pink-600/10" />
        <CardContent className="p-8 text-center relative">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30 glow-sm">
            <Video className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Interview Scheduling{" "}
            <span className="gradient-text">Coming Soon</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Full calendar integration with automated email invites, video call
            links, and interview slot management is being built. For now, reach
            out to candidates via messages.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button
              variant="outline"
              className="rounded-xl border-white/10 bg-transparent hover:bg-white/[0.05]"
              asChild
            >
              <Link href="/employer/chat">
                <MessageSquare className="mr-2 h-4 w-4" /> Open Messages
              </Link>
            </Button>
            <Button
              className="rounded-xl border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500"
              asChild
            >
              <Link href="/employer/candidates">
                <Users className="mr-2 h-4 w-4" /> View Candidates
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
