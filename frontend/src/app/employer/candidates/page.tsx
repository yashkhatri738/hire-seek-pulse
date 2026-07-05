import React from "react";
import { getEmployerReceivedApplications } from "@/lib/action/employer/application.action";
import { getCurrentUser } from "@/lib/action/auth.quires";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Users, Briefcase, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CandidateModal } from "./candidate-modal";
import { statusStyle } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function EmployerCandidatesPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "employer") {
    redirect("/login");
  }

  const applicationsRes = await getEmployerReceivedApplications();
  const applications = applicationsRes.data || [];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            <span className="gradient-text">Candidates</span> & Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Review profiles and manage statuses of {applications.length}{" "}
            applicants.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/employer/postjob">
            <Button
              variant="outline"
              className="rounded-xl h-10 border-white/10 bg-transparent hover:bg-white/[0.05]"
            >
              Post New Job
            </Button>
          </Link>
          <Link href="/employer/dashboard">
            <Button className="rounded-xl h-10 border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card className="border-dashed border-2 border-white/[0.08] bg-white/[0.02]">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center justify-center mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              No Applications Yet
            </h2>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              You haven&apos;t received any applications yet. Make sure your job
              posts are active and visible.
            </p>
            <Link href="/employer/postjob">
              <Button className="rounded-xl border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500">
                Post a Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/[0.03] border-b border-white/[0.06]">
                <tr>
                  <th className="px-6 py-4 font-medium">Candidate</th>
                  <th className="px-6 py-4 font-medium">Applied For</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {applications.map((item, index) => {
                  const st = statusStyle(item.application.status);
                  return (
                    <tr
                      key={index}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center overflow-hidden shrink-0">
                            {item.applicantInfo?.avatarUrl ? (
                              <img
                                src={item.applicantInfo.avatarUrl}
                                alt="avatar"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="font-semibold text-violet-300">
                                {item.application.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-base text-white">
                              {item.application.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.application.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                          <Link
                            href={`/employer/application/${item.job?.id}`}
                            className="font-medium text-foreground hover:text-violet-300 transition-colors"
                          >
                            {item.job?.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0" />
                          {format(
                            new Date(item.application.appliedAt),
                            "MMM d, yyyy",
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge className={`border-0 ${st.badge}`}>
                          {st.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <CandidateModal data={item} />
                          <Link
                            href={`/employer/chat?receiverId=${item.userAccount?.id}`}
                          >
                            <Button
                              variant="outline"
                              className="border-white/10 bg-transparent hover:bg-white/[0.05]"
                            >
                              Message
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
