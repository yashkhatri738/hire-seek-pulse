import React from "react";
import { getAllJobs } from "@/lib/action/employer/job.action";
import JobDashboardClient from "@/components/applicant/job-dashboard-client";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ApplicantDashboard({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const query = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined;
    
    const jobsData = await getAllJobs();

    return <JobDashboardClient initialJobs={jobsData} initialSearch={query || ""} />;
}