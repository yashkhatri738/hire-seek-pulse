"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Briefcase,
  GraduationCap,
  Upload,
  FileText,
  ExternalLink,
  Sparkles,
  User,
  Heart,
  Flag,
  CheckCircle2,
  FolderKanban,
  Rocket,
  Award,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import {
  ExperienceItem,
  EducationItem,
  ProjectItem,
} from "@/lib/schemaValidation/applicant.schema";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";

interface ProfileViewProps {
  data: any;
}

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------ */
/*  Helper: initials from name                                         */
/* ------------------------------------------------------------------ */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ------------------------------------------------------------------ */
/*  Profile completeness                                               */
/* ------------------------------------------------------------------ */
function calcCompleteness(data: any): number {
  const fields = [
    data.user?.name,
    data.user?.email,
    data.user?.phoneNumber,
    data.biography,
    data.dateOfBirth,
    data.nationality,
    data.resumeUrl,
    data.user?.avatarUrl,
    data.maritalStatus,
    data.gender,
    data.education?.length > 0,
    data.experience?.length > 0,
    data.projects?.length > 0,
    data.websiteUrl,
    data.location,
    data.skills,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */
export function ProfileView({ data }: ProfileViewProps) {
  const router = useRouter();
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);

  const name = data.user?.name || "User";
  const email = data.user?.email || "";
  const phone = data.user?.phoneNumber || "";
  const avatar = data.user?.avatarUrl || "";
  const bio = data.biography || "";
  const location = data.location || "";
  const nationality = data.nationality || "";
  const website = data.websiteUrl || "";
  const resumeUrl = data.resumeUrl || "";
  const dob = data.dateOfBirth
    ? format(new Date(data.dateOfBirth), "MMM dd, yyyy")
    : "";
  const gender = data.gender || "";
  const maritalStatus = data.maritalStatus || "";

  const education: EducationItem[] = Array.isArray(data.education)
    ? data.education
    : [];
  const experience: ExperienceItem[] = Array.isArray(data.experience)
    ? data.experience
    : [];
  const projects: ProjectItem[] = Array.isArray(data.projects)
    ? data.projects
    : [];
  const skills = data.skills
    ? data.skills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

  const completeness = calcCompleteness(data);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-6 pb-16"
    >
      {/* ============================================================ */}
      {/*  HERO / BANNER CARD                                           */}
      {/* ============================================================ */}
      <motion.div variants={fadeUp}>
        <Card className="overflow-hidden relative border-white/[0.06] bg-white/[0.03] backdrop-blur-sm card-shadow">
          {/* Gradient banner */}
          <div className="h-44 sm:h-52 relative overflow-hidden bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-pink-600/20">
            <div className="absolute inset-0 bg-dot-pattern opacity-60" />
            <div className="absolute top-6 right-12 w-28 h-28 rounded-full bg-violet-500/20 blur-2xl" />
            <div className="absolute bottom-4 left-16 w-20 h-20 rounded-full bg-pink-500/20 blur-xl" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
          </div>

          {/* Profile info overlay */}
          <CardContent className="relative px-6 sm:px-8 pb-8 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <motion.div variants={scaleIn} className="relative group">
                <div className="ring-4 ring-[#0a0a0f] rounded-full shadow-xl glow-sm">
                  <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border-4 border-[#0a0a0f]">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-violet-600 to-purple-600 text-white">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-[#0a0a0f]" />
              </motion.div>

              <div className="flex-1 space-y-1 pt-2 sm:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  {name}
                  <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0" />
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">
                  {experience.length > 0
                    ? experience[0].role
                    : "Software Professional"}
                  {experience.length > 0 && ` at ${experience[0].company}`}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground pt-1">
                  {location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {location}
                    </span>
                  )}
                  {email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {email}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 sm:self-center">
                <Dialog
                  open={resumeDialogOpen}
                  onOpenChange={setResumeDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="gap-2 h-11 px-6 border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500"
                      id="upload-resume-btn"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md glass-strong border-white/[0.08]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-white">
                        <FileText className="h-5 w-5 text-violet-400" />
                        Upload Your Resume
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Upload your latest resume in PDF format. Max file size
                        5MB.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div className="border-2 border-dashed border-violet-500/30 rounded-xl p-8 text-center bg-white/[0.02]">
                        <UploadButton
                          endpoint="resumeUploader"
                          onClientUploadComplete={(res) => {
                            if (res?.[0]?.url) {
                              toast.success("Resume uploaded successfully!");
                              setResumeDialogOpen(false);
                              router.refresh();
                            }
                          }}
                          onUploadError={(error) => {
                            toast.error(
                              error?.message || "Failed to upload resume",
                            );
                          }}
                        />
                      </div>
                      {resumeUrl && (
                        <div className="flex items-center gap-2 p-3 rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm">
                          <FileText className="h-4 w-4 text-violet-400 shrink-0" />
                          <span className="truncate flex-1 text-muted-foreground">
                            Current: {resumeUrl}
                          </span>
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-violet-300 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {website && (
                  <Button
                    variant="outline"
                    asChild
                    className="h-11 gap-2 border-white/10 bg-transparent hover:bg-white/[0.05]"
                  >
                    <a href={website} target="_blank" rel="noreferrer">
                      <Globe className="h-4 w-4" />
                      Portfolio
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <motion.div variants={fadeUp} className="space-y-6">
          <Card className="glass-card card-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-violet-400" />
                  Profile Strength
                </h3>
                <span className="text-sm font-bold gradient-text">
                  {completeness}%
                </span>
              </div>
              <Progress
                value={completeness}
                className="h-2.5 bg-white/[0.06] [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-pink-500"
              />
            </CardContent>
          </Card>

          <Card className="glass-card card-shadow">
            <CardContent className="pt-6 space-y-5">
              <h3 className="font-semibold text-base text-white flex items-center gap-2">
                <User className="h-4 w-4 text-violet-400" />
                Personal Details
              </h3>
              <div className="space-y-4">
                {email && (
                  <DetailRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={email}
                  />
                )}
                {phone && (
                  <DetailRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={phone}
                  />
                )}
                {dob && (
                  <DetailRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="DOB"
                    value={dob}
                  />
                )}
                {nationality && (
                  <DetailRow
                    icon={<Flag className="h-4 w-4" />}
                    label="Nationality"
                    value={nationality}
                  />
                )}
                {gender && (
                  <DetailRow
                    icon={<User className="h-4 w-4" />}
                    label="Gender"
                    value={gender}
                  />
                )}
                {maritalStatus && (
                  <DetailRow
                    icon={<Heart className="h-4 w-4" />}
                    label="Status"
                    value={maritalStatus}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-shadow">
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-base text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill: string, i: any) => (
                    <span
                      key={i}
                      className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No skills listed.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={fadeUp}>
            <Card className="glass-card card-shadow">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-violet-400" />
                  About
                </h3>
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                  {bio || "No biography provided yet."}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Experience Timeline */}
          <motion.div variants={fadeUp}>
            <Card className="glass-card card-shadow">
              <CardContent className="pt-6 space-y-6">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-violet-400" />
                  Experience
                </h3>

                <div className="space-y-0">
                  {experience.length > 0 ? (
                    experience.map((exp, index) => (
                      <div
                        key={index}
                        className="relative pl-8 pb-8 last:pb-0 group"
                      >
                        {index < experience.length - 1 && (
                          <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-violet-500/40 to-white/[0.06]" />
                        )}
                        <div
                          className={`absolute left-0 top-1.5 h-6 w-6 rounded-full flex items-center justify-center ${exp.current ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white glow-sm" : "bg-white/[0.05] text-muted-foreground border border-white/[0.1]"}`}
                        >
                          <Briefcase className="h-3 w-3" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold text-white">
                                {exp.role}
                              </h4>
                              <p className="text-sm text-violet-300 font-medium">
                                {exp.company}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-xs text-muted-foreground">
                              {exp.period}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No experience added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Education Cards */}
          <motion.div variants={fadeUp}>
            <Card className="glass-card card-shadow">
              <CardContent className="pt-6 space-y-5">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-violet-400" />
                  Education
                </h3>
                <div className="space-y-4">
                  {education.length > 0 ? (
                    education.map((edu, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.03] transition-colors hover:border-violet-500/20"
                      >
                        <div className="h-10 w-10 rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center shrink-0">
                          <GraduationCap className="h-5 w-5 text-violet-300" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">
                            {edu.degree}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {edu.school}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] text-muted-foreground">
                              {edu.year}
                            </span>
                            {edu.grade && (
                              <span className="text-xs text-violet-300 font-medium flex items-center gap-1">
                                <Award className="h-3 w-3" /> {edu.grade}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No education added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Projects Grid */}
          <motion.div variants={fadeUp}>
            <Card className="glass-card card-shadow">
              <CardContent className="pt-6 space-y-5">
                <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-violet-400" />
                  Projects
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.length > 0 ? (
                    projects.map((proj, index) => (
                      <div
                        key={index}
                        className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.03] transition-all hover:border-violet-500/25 hover:bg-white/[0.05] group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-10 w-10 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center">
                            <Rocket className="h-5 w-5 text-violet-300" />
                          </div>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-violet-300 transition-colors" />
                            </a>
                          )}
                        </div>
                        <h4 className="font-semibold text-white mb-1">
                          {proj.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {proj.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {proj.tech.split(",").map((t, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-muted-foreground"
                            >
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic col-span-2">
                      No projects added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center text-violet-300 shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-white capitalize truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
