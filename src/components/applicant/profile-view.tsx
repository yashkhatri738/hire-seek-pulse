"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { ExperienceItem, EducationItem, ProjectItem } from "@/lib/schemaValidation/applicant.schema";

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
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
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
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  
  const education: EducationItem[] = Array.isArray(data.education) ? data.education : [];
  const experience: ExperienceItem[] = Array.isArray(data.experience) ? data.experience : [];
  const projects: ProjectItem[] = Array.isArray(data.projects) ? data.projects : [];
  const skills = data.skills ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
  
  const completeness = calcCompleteness(data);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

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
        <Card className="overflow-hidden border-0 card-shadow relative">
          {/* Gradient banner */}
          <div className="h-44 sm:h-52 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary" />
            <div className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />
            <div className="absolute top-6 right-12 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-4 left-16 w-20 h-20 rounded-full bg-white/10 blur-xl" />
          </div>

          {/* Profile info overlay */}
          <CardContent className="relative px-6 sm:px-8 pb-8 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <motion.div variants={scaleIn} className="relative group">
                <div className="ring-4 ring-background rounded-full shadow-xl">
                  <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border-4 border-background">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-primary to-secondary text-white">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-background" />
              </motion.div>

              <div className="flex-1 space-y-1 pt-2 sm:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
                  {name}
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">
                  {experience.length > 0 ? experience[0].role : "Software Professional"}
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
                <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="gap-2 gradient-primary text-white shadow-lg h-11 px-6"
                      id="upload-resume-btn"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Upload Your Resume
                      </DialogTitle>
                      <DialogDescription>
                        Upload your latest resume in PDF format. Max file size 5MB.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <div
                        className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileSelect}
                        />
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          {selectedFile ? (
                            <p className="font-medium text-foreground">{selectedFile.name}</p>
                          ) : (
                            <p className="font-medium text-foreground">Click to browse</p>
                          )}
                        </div>
                      </div>
                      {resumeUrl && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="truncate flex-1">Current: {resumeUrl}</span>
                          <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                      <Button className="w-full h-11 gradient-primary text-white" disabled={!selectedFile}>
                        Upload Resume
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {website && (
                  <Button variant="outline" asChild className="h-11 gap-2">
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
          <Card className="card-shadow border-0">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Profile Strength
                </h3>
                <span className="text-sm font-bold text-primary">{completeness}%</span>
              </div>
              <Progress value={completeness} className="h-2.5 bg-muted" />
            </CardContent>
          </Card>

          <Card className="card-shadow border-0">
            <CardContent className="pt-6 space-y-5">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Personal Details
              </h3>
              <div className="space-y-4">
                {email && <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={email} />}
                {phone && <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={phone} />}
                {dob && <DetailRow icon={<Calendar className="h-4 w-4" />} label="DOB" value={dob} />}
                {nationality && <DetailRow icon={<Flag className="h-4 w-4" />} label="Nationality" value={nationality} />}
                {gender && <DetailRow icon={<User className="h-4 w-4" />} label="Gender" value={gender} />}
                {maritalStatus && <DetailRow icon={<Heart className="h-4 w-4" />} label="Status" value={maritalStatus} />}
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-0">
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-0">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">No skills listed.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={fadeUp}>
            <Card className="card-shadow border-0">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  About
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {bio || "No biography provided yet."}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Experience Timeline */}
          <motion.div variants={fadeUp}>
            <Card className="card-shadow border-0">
              <CardContent className="pt-6 space-y-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Experience
                </h3>

                <div className="space-y-0">
                  {experience.length > 0 ? (
                    experience.map((exp, index) => (
                      <div key={index} className="relative pl-8 pb-8 last:pb-0 group">
                        {index < experience.length - 1 && (
                          <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-primary/30 to-border" />
                        )}
                        <div className={`absolute left-0 top-1.5 h-6 w-6 rounded-full flex items-center justify-center ${exp.current ? "bg-primary text-white" : "bg-muted border-2"}`}>
                          <Briefcase className="h-3 w-3" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold">{exp.role}</h4>
                              <p className="text-sm text-primary font-medium">{exp.company}</p>
                            </div>
                            <Badge variant="outline" className="text-xs font-normal">
                              {exp.period}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{exp.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No experience added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Education Cards */}
          <motion.div variants={fadeUp}>
            <Card className="card-shadow border-0">
              <CardContent className="pt-6 space-y-5">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education
                </h3>
                <div className="space-y-4">
                  {education.length > 0 ? (
                    education.map((edu, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 transition-colors">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">{edu.school}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-[10px] h-5">{edu.year}</Badge>
                            {edu.grade && (
                              <span className="text-xs text-primary font-medium flex items-center gap-1">
                                <Award className="h-3 w-3" /> {edu.grade}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No education added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Projects Grid */}
          <motion.div variants={fadeUp}>
            <Card className="card-shadow border-0">
              <CardContent className="pt-6 space-y-5">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-primary" />
                  Projects
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.length > 0 ? (
                    projects.map((proj, index) => (
                      <div key={index} className="p-5 rounded-xl border bg-card hover:bg-muted/30 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Rocket className="h-5 w-5 text-primary" />
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                            </a>
                          )}
                        </div>
                        <h4 className="font-semibold mb-1">{proj.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{proj.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {proj.tech.split(",").map((t, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-muted">{t.trim()}</span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic col-span-2">No projects added yet.</p>
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

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium capitalize truncate">{value}</p>
      </div>
    </div>
  );
}
