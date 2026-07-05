"use server"

import { JobFormData, jobSchema } from "@/lib/schemaValidation/job.schema";
import { getCurrentUser } from "../auth.quires";
import { createSupabaseServerClient } from "../../supabase";

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

        const supabase = await createSupabaseServerClient();
        const { error: dbError } = await supabase
            .from("jobs")
            .insert({
                title: jobData.title,
                employer_id: user.id,
                description: jobData.description,
                tags: jobData.tags,
                min_salary: jobData.minSalary,
                max_salary: jobData.maxSalary,
                salary_currency: jobData.salaryCurrency,
                salary_period: jobData.salaryPeriod,
                location: jobData.location,
                job_type: jobData.jobType,
                work_type: jobData.workType,
                job_level: jobData.jobLevel,
                experience: jobData.experience,
                min_education: jobData.minEducation,
                expires_at: jobData.expiresAt ? new Date(jobData.expiresAt).toISOString() : null,
            });

        if (dbError) throw dbError;

        return { status: "SUCCESS", message: "Job created successfully" };
    } catch (error) {
        console.error("Error creating job:", error);
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

        const supabase = await createSupabaseServerClient();

        const { error: dbError } = await supabase
            .from("jobs")
            .update({
                title: jobData.title,
                description: jobData.description,
                tags: jobData.tags,
                min_salary: jobData.minSalary,
                max_salary: jobData.maxSalary,
                salary_currency: jobData.salaryCurrency,
                salary_period: jobData.salaryPeriod,
                location: jobData.location,
                job_type: jobData.jobType,
                work_type: jobData.workType,
                job_level: jobData.jobLevel,
                experience: jobData.experience,
                min_education: jobData.minEducation,
                expires_at: jobData.expiresAt ? new Date(jobData.expiresAt).toISOString() : null,
            })
            .eq("id", id);

        if (dbError) throw dbError;

        return { status: "SUCCESS", message: "Job updated successfully" };
    } catch (error) {
        console.error("Error updating job:", error);
        return { status: "ERROR", message: "Failed to update job" };
    }
}

const mapJobItem = (item: any) => ({
    job: {
        id: item.id,
        title: item.title,
        employersId: item.employer_id,
        description: item.description,
        tags: item.tags,
        minSalary: item.min_salary,
        maxSalary: item.max_salary,
        salaryCurrency: item.salary_currency,
        salaryPeriod: item.salary_period,
        location: item.location,
        jobType: item.job_type,
        workType: item.work_type,
        jobLevel: item.job_level,
        experience: item.experience,
        minEducation: item.min_education,
        isFeatured: item.is_featured,
        expiresAt: item.expires_at,
        deletedAt: item.deleted_at,
        createdAt: item.created_at,
        updatedAt: item.updated_at
    },
    employer: item.employer ? {
        id: item.employer.id,
        name: item.employer.name,
        description: item.employer.description,
        avatarUrl: item.employer.avatar_url,
        bannerImageUrl: item.employer.banner_image_url,
        organizationType: item.employer.organization_type,
        teamSize: item.employer.team_size,
        yearOfEstablishment: item.employer.year_of_establishment,
        websiteUrl: item.employer.website_url,
        location: item.employer.location,
        deletedAt: item.employer.deleted_at,
        createdAt: item.employer.created_at,
        updatedAt: item.employer.updated_at
    } : null
});

export const getJobById = async (id: number) => {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: job, error } = await supabase
            .from("jobs")
            .select(`
                *,
                employer:employers (
                    *
                )
            `)
            .eq("id", id)
            .maybeSingle();

        if (error || !job) {
            return { status: "ERROR", message: "Job not found" };
        }

        return { status: "SUCCESS", data: [mapJobItem(job)] };
    } catch (error) {
        console.error("Error getting job by id:", error);
        return { status: "ERROR", message: "Failed to get job" };
    }
}

export const getJobsByEmployer = async () => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("Unauthorized");
        }

        const supabase = await createSupabaseServerClient();
        const { data: list, error } = await supabase
            .from("jobs")
            .select(`
                *,
                employer:employers (
                    *
                )
            `)
            .eq("employer_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return (list || []).map(mapJobItem);
    } catch (error) {
        console.error("Error getting jobs", error);
        return [];
    }
};

export interface JobFilters {
    search?: string;
    jobType?: string[];
    workType?: string[];
    jobLevel?: string[];
    location?: string;
    minSalary?: number;
    maxSalary?: number;
}

export const getAllJobs = async (search?: string) => {
    try {
        const supabase = await createSupabaseServerClient();
        let query = supabase
            .from("jobs")
            .select(`
                *,
                employer:employers (
                    *
                )
            `);

        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.ilike.%${search}%`);
        }

        const { data: list, error } = await query.order("created_at", { ascending: false });
        if (error) throw error;

        return (list || []).map(mapJobItem);
    } catch (error) {
        console.error("Error getting all jobs", error);
        return [];
    }
};

export const getAllJobsFiltered = async (filters: JobFilters = {}) => {
    try {
        const supabase = await createSupabaseServerClient();
        let query = supabase
            .from("jobs")
            .select(`
                *,
                employer:employers (
                    *
                )
            `);

        if (filters.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tags.ilike.%${filters.search}%`);
        }

        if (filters.jobType && filters.jobType.length > 0) {
            query = query.in("job_type", filters.jobType);
        }

        if (filters.workType && filters.workType.length > 0) {
            query = query.in("work_type", filters.workType);
        }

        if (filters.jobLevel && filters.jobLevel.length > 0) {
            query = query.in("job_level", filters.jobLevel);
        }

        if (filters.location) {
            query = query.ilike("location", `%${filters.location}%`);
        }

        if (filters.minSalary) {
            query = query.gte("max_salary", filters.minSalary);
        }
        if (filters.maxSalary) {
            query = query.lte("min_salary", filters.maxSalary);
        }

        const { data: list, error } = await query.order("created_at", { ascending: false });
        if (error) throw error;

        return (list || []).map(mapJobItem);
    } catch (error) {
        console.error("Error getting filtered jobs", error);
        return [];
    }
};

export const deleteJob = async (id: number) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { status: "ERROR", message: "User not found" };
        }

        const supabase = await createSupabaseServerClient();
        const { data: existingJob, error: fetchError } = await supabase
            .from("jobs")
            .select("employer_id")
            .eq("id", id)
            .maybeSingle();

        if (fetchError || !existingJob) {
            return { status: "ERROR", message: "Job not found" };
        }

        if (existingJob.employer_id !== user.id) {
            return { status: "ERROR", message: "Unauthorized to delete this job" };
        }

        const { error: deleteError } = await supabase
            .from("jobs")
            .delete()
            .eq("id", id);

        if (deleteError) throw deleteError;

        return { status: "SUCCESS", message: "Job deleted successfully" };
    } catch (error) {
        console.error("Error deleting job", error);
        return { status: "ERROR", message: "Failed to delete job" };
    }
};