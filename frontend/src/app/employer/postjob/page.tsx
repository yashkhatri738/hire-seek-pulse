import { JobForm } from "@/components/employer/job-form";

export default function PostJobPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Post a New Job</h1>
        <p className="text-muted-foreground mt-2">
          Fill out the form below to create a new job listing on your employer dashboard.
        </p>
      </div>

      <JobForm />
    </div>
  );
}
