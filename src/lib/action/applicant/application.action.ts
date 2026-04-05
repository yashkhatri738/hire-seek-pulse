"use server"

import { db } from "@/config/db";
import { jobApplications, jobs, employers } from "@/drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUser } from "../auth.quires";
import { revalidatePath } from "next/cache";

export type ApplicationInput = {
    jobId: number;
    name: string;
    email: string;
    phoneNumber?: string;
    resumeUrl: string;
    coverLetter?: string;
    linkedInUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    yearsOfExperience?: string;
}

export const submitApplication = async (data: ApplicationInput) => {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "applicant") {
            return { status: "ERROR", message: "Unauthorized or not an applicant." };
        }

        // Check if already applied
        const existing = await db.select().from(jobApplications)
            .where(and(
                eq(jobApplications.jobId, data.jobId),
                eq(jobApplications.applicantId, user.id)
            ));

        if (existing.length > 0) {
            return { status: "ERROR", message: "You have already applied for this job." };
        }

        await db.insert(jobApplications).values({
            jobId: data.jobId,
            applicantId: user.id,
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber || "",
            resumeUrl: data.resumeUrl,
            coverLetter: data.coverLetter || "",
            linkedInUrl: data.linkedInUrl || "",
            githubUrl: data.githubUrl || "",
            portfolioUrl: data.portfolioUrl || "",
            yearsOfExperience: data.yearsOfExperience || "",
            status: "applied"
        });

        revalidatePath(`/jobs/${data.jobId}`);
        revalidatePath(`/applications`);
        
        return { status: "SUCCESS", message: "Application submitted successfully." };
    } catch (error: any) {
        console.error("Error submitting application:", error);
        return { status: "ERROR", message: error?.message || "Failed to submit application." };
    }
}

export const getMyApplications = async () => {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "applicant") {
            return { status: "ERROR", data: [] };
        }

        const list = await db.select({
            application: jobApplications,
            job: jobs,
            employer: employers
        })
        .from(jobApplications)
        .where(eq(jobApplications.applicantId, user.id))
        .leftJoin(jobs, eq(jobs.id, jobApplications.jobId))
        .leftJoin(employers, eq(employers.id, jobs.employersId))
        .orderBy(desc(jobApplications.appliedAt));

        return { status: "SUCCESS", data: list };
    } catch (error) {
         console.error("Error fetching applications:", error);
         return { status: "ERROR", data: [] };
    }
}
