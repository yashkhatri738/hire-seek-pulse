import { getJobById } from "@/lib/action/employer/job.action";
import { JobForm } from "@/components/employer/job-form";
import { notFound } from "next/navigation";
import { ChevronLeft, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditJobPage({ params }: PageProps) {
  const resolvedParams = await params;
  const jobId = parseInt(resolvedParams.id);

  if (isNaN(jobId)) {
    notFound();
  }

  const result = await getJobById(jobId);

  // getJobById returns { status, data: job[] }
  if (result.status !== "SUCCESS" || !result.data || result.data.length === 0) {
    notFound();
  }

  const jobData = result.data[0].job;

  return (
    <div className="max-w-5xl mx-auto py-8 flex flex-col gap-6">
      <div>
        <Link
          href="/employer/application"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Jobs
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center justify-center">
            <Pencil className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Edit <span className="gradient-text">Job Details</span>
          </h1>
        </div>
        <p className="text-muted-foreground mt-2 ml-[52px] text-sm">
          Make changes to your job posting and click update to save.
        </p>
      </div>

      <JobForm initialData={jobData as any} />
    </div>
  );
}
