"use server"

import { JobFormData, jobSchema } from "@/lib/schemaValidation/job.schema";
import { getCurrentUser } from "../auth.quires";
import { employers, jobs } from "@/drizzle/schema";
import { db } from "@/config/db";  
import { eq, and, desc, or, like } from "drizzle-orm";

export const createJob = async (data: JobFormData) => {
    try {
        const { success, data: jobData, error } = jobSchema.safeParse(data);
        if (!success) {
            return { status: "ERROR", message: error.errors };
        }

        const user = await getCurrentUser();
        if (!user) {
            return { status: "ERROR", message: "User not found" };
        }

        await db.insert(jobs).values({
            ...jobData,
            employersId: user.id,
        });

        return { status: "SUCCESS", message: "Job created successfully" };
    } catch (error) {
        return { status: "ERROR", message: "Failed to create job" };
    }  
}

export const updateJob = async (id: number, data: JobFormData) => {
    try {
        const { success, data: jobData, error } = jobSchema.safeParse(data);
        if (!success) {
            return { status: "ERROR", message: error.errors };
        }

        const user = await getCurrentUser();
        if (!user) {
            return { status: "ERROR", message: "User not found" };
        }

        const existingJob = await db.select().from(jobs).where(eq(jobs.id, id));
        if (!existingJob) {
            return { status: "ERROR", message: "Job not found" };   
        }

        await db.update(jobs)
            .set({ ...jobData })
            .where(eq(jobs.id, id));
        
        if (error) {
            return { status: "ERROR", message: "Failed to update job" };
        }

        return { status: "SUCCESS", message: "Job updated successfully" };
    } catch (error) {
        return { status: "ERROR", message: "Failed to update job" };
    }  
}

export const getJobById = async (id: number) => {
    try {
        const job = await db.select().from(jobs).where(eq(jobs.id, id));
        if (!job) {
            return { status: "ERROR", message: "Job not found" };
        }
        return { status: "SUCCESS", data: job };
    } catch (error) {
        return { status: "ERROR", message: "Failed to get job" };
    }
}

export const getJobWithEmployer = async () => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("Unauthorized");
        }

        const job = await db.select({
            job: jobs,
            employer: employers
        })
        .from(jobs)
        .leftJoin(employers, eq(jobs.employersId, employers.id))
        .where(eq(jobs.employersId, user.id))
        .then(res => res[0]);
        
        return job;
    } catch (error) {
        console.error("Error getting job details", error);
        return null;
    }
};

export const getAllJobs = async (search?: string) => {
    try {
        // getAllJobs might be public or role-agnostic, but we'll follow previous pattern
        const allJobs = await db.select({
            job: jobs,
            employer: employers
        })
        .from(jobs)
        .leftJoin(employers, eq(jobs.employersId, employers.id))
        .where(
            search ? or(
                like(jobs.title, `%${search}%`),
                like(jobs.description, `%${search}%`),
                like(jobs.tags, `%${search}%`),
                like(employers.name, `%${search}%`)
            ) : undefined
        )
        .orderBy(desc(jobs.createdAt));
        
        return allJobs;
    } catch (error) {
        console.error("Error getting all jobs", error);
        return [];
    }
};