"use server"

import { JobFormData, jobSchema } from "@/lib/schemaValidation/job.schema";
import { getCurrentUser } from "../auth.quires";
import { employers, jobs } from "@/drizzle/schema";
import { db } from "@/config/db";  
import { eq, and, desc, or, like, gte, lte } from "drizzle-orm";

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
        const job = await db.select({
            job: jobs,
            employer: employers
        })
        .from(jobs)
        .leftJoin(employers, eq(jobs.employersId, employers.id))
        .where(eq(jobs.id, id));

        if (!job || job.length === 0) {
            return { status: "ERROR", message: "Job not found" };
        }
        return { status: "SUCCESS", data: job };
    } catch (error) {
        return { status: "ERROR", message: "Failed to get job" };
    }
}

export const getJobsByEmployer = async () => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("Unauthorized");
        }

        const jobsList = await db.select({
            job: jobs,
            employer: employers
        })
        .from(jobs)
        .leftJoin(employers, eq(jobs.employersId, employers.id))
        .where(eq(jobs.employersId, user.id))
        .orderBy(desc(jobs.createdAt));
        
        return jobsList;
    } catch (error) {
        console.error("Error getting jobs", error);
        return [];
    }
};

export interface JobFilters {
    search?: string;
    jobType?: string[];     // remote, hybrid, on-site
    workType?: string[];    // full-time, part-time, contract, etc.
    jobLevel?: string[];    // entry level, junior, mid level, etc.
    location?: string;
    minSalary?: number;
    maxSalary?: number;
}

export const getAllJobs = async (search?: string) => {
    try {
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

export const getAllJobsFiltered = async (filters: JobFilters = {}) => {
    try {
        const conditions: any[] = [];

        // Text search
        if (filters.search) {
            conditions.push(
                or(
                    like(jobs.title, `%${filters.search}%`),
                    like(jobs.description, `%${filters.search}%`),
                    like(jobs.tags, `%${filters.search}%`),
                    like(employers.name, `%${filters.search}%`)
                )
            );
        }

        // Job type filter (remote/hybrid/on-site)
        if (filters.jobType && filters.jobType.length > 0) {
            conditions.push(
                or(...filters.jobType.map(t => eq(jobs.jobType, t as any)))
            );
        }

        // Work type filter (full-time/part-time/contract, etc.)
        if (filters.workType && filters.workType.length > 0) {
            conditions.push(
                or(...filters.workType.map(t => eq(jobs.workType, t as any)))
            );
        }

        // Job level filter
        if (filters.jobLevel && filters.jobLevel.length > 0) {
            conditions.push(
                or(...filters.jobLevel.map(l => eq(jobs.jobLevel, l as any)))
            );
        }

        // Location filter
        if (filters.location) {
            conditions.push(like(jobs.location, `%${filters.location}%`));
        }

        // Salary range filter
        if (filters.minSalary) {
            conditions.push(gte(jobs.maxSalary, filters.minSalary));
        }
        if (filters.maxSalary) {
            conditions.push(lte(jobs.minSalary, filters.maxSalary));
        }

        const allJobs = await db.select({
            job: jobs,
            employer: employers
        })
        .from(jobs)
        .leftJoin(employers, eq(jobs.employersId, employers.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(jobs.createdAt));
        
        return allJobs;
    } catch (error) {
        console.error("Error getting filtered jobs", error);
        return [];
    }
};