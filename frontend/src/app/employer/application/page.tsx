import React from "react";
import { getJobsByEmployer } from "@/lib/action/employer/job.action";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";
import { JobCard } from "@/components/employer/job-card";

export const dynamic = "force-dynamic";

const ApplicationPage = async () => {
  const jobs = await getJobsByEmployer();

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            My <span className="gradient-text">Posted Jobs</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and edit your {jobs.length} job listings.
          </p>
        </div>
        <Button
          className="rounded-xl h-10 border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500"
          asChild
        >
          <Link href="/employer/postjob">
            <Plus className="mr-2 h-4 w-4" /> Post New Job
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.length === 0 ? (
          <Card className="col-span-full border-dashed border-2 border-white/[0.08] bg-white/[0.02]">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-2xl bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                No Jobs Posted Yet
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
                Create your first job listing to start receiving applications
                from top candidates.
              </p>
              <Button
                className="rounded-xl border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500"
                asChild
              >
                <Link href="/employer/postjob">
                  <Plus className="mr-2 h-4 w-4" /> Post First Job
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          jobs.map(({ job }) => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default ApplicationPage;
