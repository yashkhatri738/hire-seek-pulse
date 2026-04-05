import { z } from "zod";

export const employerSettingsSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long"),

  organizationType: z
    .string()
    .min(2, "Organization type is required"),

  yearOfEstablishment: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid year")
    .refine(
      (year) => Number(year) <= new Date().getFullYear(),
      "Year cannot be in the future"
    ),

  teamSize: z
    .string()
    .min(1, "Team size is required"),

  websiteUrl: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),

  location: z
    .string()
    .min(2, "Location is required"),

  avatarUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(),
});

export type EmployerSettingsInput = z.infer<typeof employerSettingsSchema>;