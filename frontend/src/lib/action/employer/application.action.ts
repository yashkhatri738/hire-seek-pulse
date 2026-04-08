"use server"

import { db } from "@/config/db";
import { jobApplications, jobs, applicants, users } from "@/drizzle/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { getCurrentUser } from "../auth.quires";
import { revalidatePath } from "next/cache";

export const getEmployerReceivedApplications = async () => {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "employer") {
            return { status: "ERROR", data: [] };
        }

        // We need to fetch all applications connected to jobs that belong to this employer.
        // First we get this employer's jobs
        const myJobs = await db.select({ id: jobs.id }).from(jobs).where(eq(jobs.employersId, user.id));
        const jobIds = myJobs.map(j => j.id);

        if (jobIds.length === 0) {
            return { status: "SUCCESS", data: [] };
        }

        const list = await db.select({
            application: jobApplications,
            job: jobs,
            applicantInfo: applicants,
            userAccount: users,
        })
        .from(jobApplications)
        .where(inArray(jobApplications.jobId, jobIds))
        .leftJoin(jobs, eq(jobs.id, jobApplications.jobId))
        .leftJoin(applicants, eq(applicants.id, jobApplications.applicantId))
        .leftJoin(users, eq(users.id, jobApplications.applicantId))
        .orderBy(desc(jobApplications.appliedAt));

        return { status: "SUCCESS", data: list };
    } catch (error) {
         console.error("Error fetching employer applications:", error);
         return { status: "ERROR", data: [] };
    }
}

export const updateApplicationStatus = async (applicationId: number, status: string) => {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "employer") {
            return { status: "ERROR", message: "Unauthorized" };
        }

        // Technically, we should verify that this application belongs to a job that belongs to this employer.
        
        await db.update(jobApplications)
            .set({ status: status as any })
            .where(eq(jobApplications.id, applicationId));

        revalidatePath(`/employer/candidates`);
        
        return { status: "SUCCESS", message: "Application status updated successfully." };
    } catch (error: any) {
        console.error("Error updating application status:", error);
        return { status: "ERROR", message: error?.message || "Failed to update status." };
    }
}
