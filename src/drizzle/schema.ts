import { JOB_LEVEL, JOB_TYPE, MIN_EDUCATION, SALARY_CURRENCY, SALARY_PERIOD, WORK_TYPE } from "@/config/constants";
import { desc, relations } from "drizzle-orm";
import {
  date,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  year,
  boolean,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  userName: varchar("username", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: mysqlEnum("role", ["admin", "applicant", "employer"])
    .default("applicant")
    .notNull(),
  phoneNumber: varchar("phone_number", { length: 255 }),
  avatarUrl: text("avatar_url"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userAgent: text("user_agent").notNull(),
  ip: varchar("ip", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const employers = mysqlTable("employers", {
  id: int("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  name: varchar("name", { length: 255 }),
  description: text("description"),
  avatarUrl: text("avatar_url"),
  bannerImageUrl: text("banner_image_url"),
  organizationType: varchar("organization_type", { length: 100 }),
  teamSize: varchar("team_size", { length: 50 }),
  yearOfEstablishment: year("year_of_establishment"), // MySQL YEAR type
  websiteUrl: varchar("website_url", { length: 255 }),
  location: varchar("location", { length: 255 }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const applicants = mysqlTable("applicants", {
  id: int("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  biography: text("biography"),
  dateOfBirth: date("date_of_birth"),
  nationality: varchar("nationality", { length: 100 }),
  resumeUrl: text("resume_url"),
  avatarUrl: text("avatar_url"),

  maritalStatus: mysqlEnum("marital_status", ["single", "married", "divorced"]),

  gender: mysqlEnum("gender", ["male", "female", "other"]),

  education: mysqlEnum("education", [
    "none",
    "high school",
    "undergraduate",
    "masters",
    "phd",
  ]),

  experience: text("experience"),
  websiteUrl: varchar("website_url", { length: 255 }),
  location: varchar("location", { length: 255 }),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

// Relations definitions
export const usersRelations = relations(users, ({ one, many }) => ({
  // One user can have one employer profile (if role is employer)
  employer: one(employers, {
    fields: [users.id],
    references: [employers.id],
  }),
  // One user can have one applicant profile (if role is applicant)
  applicant: one(applicants, {
    fields: [users.id],
    references: [applicants.id],
  }),
  // One user can have many sessions
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  // Each session belongs to one user
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  employersId: int("employer_id")
    .notNull()
    .references(() => employers.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  tags: text("tags"),
  minSalary: int("min_salary"),
  maxSalary: int("max_salary"),
  salaryCurrency: mysqlEnum("salary_currency", SALARY_CURRENCY),
  salaryPeriod: mysqlEnum("salary_period", SALARY_PERIOD),
  location: varchar("location", { length: 255 }),
  jobType: mysqlEnum("job_type", JOB_TYPE),
  workType: mysqlEnum("work_type", WORK_TYPE),
  jobLevel: mysqlEnum("job_level", JOB_LEVEL),
  experience: text("experience"),
  minEducation: mysqlEnum("min_education", MIN_EDUCATION),
  isFeatured: boolean("is_featured").default(false).notNull(),
  expiresAt: timestamp("expires_at"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const jobsRelations = relations(jobs, ({ one }) => ({
  // Each job belongs to one employer
  employer: one(employers, {
    fields: [jobs.employersId],
    references: [employers.id],
  }),
}));


export const jobApplications = mysqlTable(
  "job_applications",
  {
    id: int("id").autoincrement().primaryKey(),

    jobId: int("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),

    applicantId: int("applicant_id")
      .notNull()
      .references(() => applicants.id, { onDelete: "cascade" }),

    // Snapshot fields
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 50 }),

    resumeUrl: text("resume_url").notNull(),
    coverLetter: text("cover_letter"),

    status: mysqlEnum("status", [
      "applied",
      "reviewing",
      "shortlisted",
      "rejected",
      "selected",
    ])
      .default("applied")
      .notNull(),

    employerNotes: text("employer_notes"),

    appliedAt: timestamp("applied_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .onUpdateNow()
      .notNull(),
  },
  (table) => ({
    uniqueApply: uniqueIndex("unique_apply").on(
      table.jobId,
      table.applicantId
    ),
  })
);

export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one }) => ({
    job: one(jobs, {
      fields: [jobApplications.jobId],
      references: [jobs.id],
    }),

    applicant: one(applicants, {
      fields: [jobApplications.applicantId],
      references: [applicants.id],
    }),
  })
);
