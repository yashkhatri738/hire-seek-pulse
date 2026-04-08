import { z } from "zod";
import { GENDER, MARITAL_STATUS } from "@/config/constants";

export const experienceItemSchema = z.object({
  role: z.string().min(2, "Role is required"),
  company: z.string().min(2, "Company is required"),
  period: z.string().min(2, "Period is required (e.g. 2021 - 2023)"),
  description: z.string().optional().nullable(),
  current: z.boolean().default(false).optional(),
});

export const educationItemSchema = z.object({
  school: z.string().min(2, "School/University is required"),
  degree: z.string().min(2, "Degree is required"),
  year: z.string().min(2, "Year is required"),
  grade: z.string().optional().nullable(),
});

export const projectItemSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  tech: z.string().min(2, "Technologies are required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  link: z.string().url("Invalid project URL").optional().nullable().or(z.literal("")),
});

export const applicantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional().nullable(),
  biography: z.string().max(1000, "Biography must be under 1000 characters").optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  resumeUrl: z.string().url("Invalid resume URL").optional().nullable().or(z.literal("")),
  avatarUrl: z.string().url("Invalid avatar URL").optional().nullable().or(z.literal("")),
  maritalStatus: z.enum(MARITAL_STATUS).optional().nullable(),
  gender: z.enum(GENDER).optional().nullable(),
  education: z.array(educationItemSchema).optional().default([]),
  experience: z.array(experienceItemSchema).optional().default([]),
  projects: z.array(projectItemSchema).optional().default([]),
  websiteUrl: z.string().url("Invalid website URL").optional().nullable().or(z.literal("")),
  location: z.string().optional().nullable(),
  skills: z.string().min(2, "Skills must be at least 2 characters"),
});

export type ApplicantFormData = z.infer<typeof applicantSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
