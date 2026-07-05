import { JobForm } from "@/components/employer/job-form";
import { Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

export default function PostJobPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center justify-center">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Post a <span className="gradient-text">New Job</span>
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground mt-2 ml-[52px]">
          Fill out the form below to create a new job listing on your employer
          dashboard.
        </p>
      </div>

      <JobForm />
    </div>
  );
}
