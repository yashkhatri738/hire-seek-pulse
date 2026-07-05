import { getJobById } from "@/lib/action/employer/job.action";
import { JobForm } from "../../../../components/employer/job-form";
import { notFound } from "next/navigation";
import { JobFormData } from "@/lib/schemaValidation/job.schema";
import { Pencil } from "lucide-react";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const resolvedParams = await params;
  const jobId = parseInt(resolvedParams.id, 10);

  if (isNaN(jobId)) {
    notFound();
  }

  const result = await getJobById(jobId);

  if (result.status === "ERROR" || !result.data || result.data.length === 0) {
    notFound();
  }

  const jobData = result.data[0].job;
  const job = jobData; // alias it to maintain existing logic below

  // Map database job object to JobFormData expected by the form
  const initialData: JobFormData & { id: number } = {
    id: job.id,
    title: job.title,
    description: job.description,
    tags: job.tags || "",
    minSalary: job.minSalary,
    maxSalary: job.maxSalary,
    salaryCurrency: job.salaryCurrency || undefined,
    salaryPeriod: job.salaryPeriod || undefined,
    location: job.location || "",
    jobType: job.jobType || "remote",
    workType: job.workType || "full-time",
    jobLevel: job.jobLevel || "internship",
    experience: job.experience || "",
    minEducation: job.minEducation || undefined,
    expiresAt: job.expiresAt ? new Date(job.expiresAt) : null,
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center justify-center shrink-0">
            <Pencil className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Edit Job: <span className="gradient-text">{job.title}</span>
          </h1>
        </div>
        <p className="text-muted-foreground mt-2 ml-[52px]">
          Update the details for this job listing to attract the right
          candidates.
        </p>
      </div>

      <JobForm initialData={initialData} />
    </div>
  );
}
