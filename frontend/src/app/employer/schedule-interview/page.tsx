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

export const dynamic = "force-dynamic";
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  Users,
  Video,
  MapPin,
  MessageSquare,
  ArrowUpRight,
  Plus,
  Briefcase,
  Mail,
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

  return (
    <div className="max-w-[1100px] mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage interviews with shortlisted candidates.
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg hover:shadow-xl transition-shadow h-10"
          asChild
        >
          <Link href="/employer/candidates">
            <Users className="mr-2 h-4 w-4" /> View All Candidates
          </Link>
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 card-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{shortlisted.length}</p>
              <p className="text-sm text-muted-foreground">
                Ready to Interview
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 card-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Scheduled Today</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 card-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-pink-100 dark:bg-pink-950 flex items-center justify-center">
              <Clock className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Ready for Interview */}
      <Card className="border-0 card-shadow overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center">
                  <Users className="h-4 w-4 text-violet-600" />
                </div>
                Shortlisted Candidates
              </CardTitle>
              <CardDescription className="mt-1">
                These candidates are ready for interview scheduling
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {shortlisted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <CalendarDays className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium">No Candidates to Interview</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Shortlist candidates from your applications to start scheduling
                interviews.
              </p>
              <Button variant="outline" className="mt-4 rounded-xl" asChild>
                <Link href="/employer/candidates">Review Candidates</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {shortlisted.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors group"
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback className="bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-950 dark:to-pink-950 text-sm font-semibold text-violet-700 dark:text-violet-300">
                      {item.application.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {item.application.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      <span className="truncate">
                        {item.job?.title || "Position"}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={`capitalize border-0 text-[11px] ${
                      item.application.status === "shortlisted"
                        ? "bg-violet-500/10 text-violet-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {item.application.status}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
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
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                      asChild
                    >
                      <a href={`mailto:${item.application.email}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coming Soon Feature Notice */}
      <Card className="border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5" />
        <CardContent className="p-8 text-center relative">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg glow-sm">
            <Video className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold">
            Interview Scheduling Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Full calendar integration with automated email invites, video call
            links, and interview slot management is being built. For now, reach
            out to candidates via messages.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/employer/chat">
                <MessageSquare className="mr-2 h-4 w-4" /> Open Messages
              </Link>
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
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
