import React from "react";
import { getJobsByEmployer } from "@/lib/action/employer/job.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import {
  Plus,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpRight,
  Briefcase,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

const ApplicationPage = async () => {
  const jobs = await getJobsByEmployer();

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Posted Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Manage and edit your {jobs.length} job listings.
          </p>
        </div>
        <Button
          className="gradient-primary text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-shadow h-10"
          asChild
        >
          <Link href="/employer/postjob">
            <Plus className="mr-2 h-4 w-4" /> Post New Job
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.length === 0 ? (
          <Card className="col-span-full border-dashed border-2 card-shadow">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">No Jobs Posted Yet</h2>
              <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
                Create your first job listing to start receiving applications
                from top candidates.
              </p>
              <Button
                className="gradient-primary text-white border-0 rounded-xl"
                asChild
              >
                <Link href="/employer/postjob">
                  <Plus className="mr-2 h-4 w-4" /> Post First Job
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          jobs.map(({ job }) => (
            <Link
              key={job.id}
              href={`/employer/application/${job.id}`}
              className="block group"
            >
              <Card className="flex flex-col h-full border-0 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                {/* Top gradient accent */}
                <div className="h-1 bg-gradient-to-r from-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {job.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{" "}
                          {job.location || "Remote"}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 capitalize">
                          <Clock className="h-3 w-3" /> {job.jobType}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {job.isFeatured && (
                        <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[10px]">
                          <Sparkles className="h-3 w-3 mr-0.5" /> Featured
                        </Badge>
                      )}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {job.description || "No description provided."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.jobLevel && (
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize font-normal"
                      >
                        {job.jobLevel}
                      </Badge>
                    )}
                    {job.workType && (
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize font-normal border-primary/20 text-primary"
                      >
                        {job.workType.replace("-", " ")}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t border-border/60 p-4 bg-muted/20">
                  <span className="text-[11px] text-muted-foreground">
                    Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
                  </span>
                  <span className="text-xs font-medium text-primary flex items-center gap-1">
                    Edit <ArrowUpRight className="h-3 w-3" />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationPage;
