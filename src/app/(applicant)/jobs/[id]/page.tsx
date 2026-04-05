import React from "react";
import { getJobById } from "@/lib/action/employer/job.action";
import { getApplicantProfile } from "@/lib/action/applicant/profile.action";
import { ApplyModal } from "./apply-modal";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
    Briefcase, 
    MapPin, 
    Clock, 
    IndianRupee, 
    Calendar, 
    ChevronLeft, 
    Globe,
    Building2,
    Users,
    GraduationCap,
    Bookmark,
    Share2,
    ExternalLink,
    Zap,
    TrendingUp,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface PageProps {
    params: Promise<{ id: string }>;
}

function formatSalary(amount: number): string {
    if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toLocaleString();
}

export default async function JobDetailsPage({ params }: PageProps) {
    const resolvedParams = await params;
    const jobId = parseInt(resolvedParams.id);

    if (isNaN(jobId)) notFound();

    const result = await getJobById(jobId);

    if (result.status !== "SUCCESS" || !result.data || result.data.length === 0) {
        notFound();
    }

    const { job, employer } = result.data[0];
    const applicantData = await getApplicantProfile();

    return (
        <div className="max-w-[1200px] mx-auto py-4 space-y-6">
            {/* Back link */}
            <Link 
                href="/dashboard" 
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
                <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Jobs
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ─── MAIN CONTENT ────────────────────────────── */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Card */}
                    <Card className="border-0 card-shadow overflow-hidden">
                        {/* Gradient accent strip */}
                        <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-secondary" />
                        
                        <CardContent className="p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                                <div className="flex items-start gap-4">
                                    {/* Company logo */}
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shrink-0 border overflow-hidden">
                                        {employer?.avatarUrl ? (
                                            <img src={employer.avatarUrl} alt={employer.name || ""} className="h-full w-full object-cover" />
                                        ) : (
                                            <Building2 className="h-7 w-7 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {job.isFeatured && (
                                                <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[10px]">
                                                    <Zap className="h-3 w-3 mr-1" /> Featured
                                                </Badge>
                                            )}
                                            {job.workType && (
                                                <Badge variant="outline" className="capitalize text-[10px]">
                                                    {job.workType.replace("-", " ")}
                                                </Badge>
                                            )}
                                        </div>
                                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2">{job.title}</h1>
                                        <p className="text-muted-foreground text-base mt-1">{employer?.name || "Anonymous Company"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                        <Bookmark className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <ApplyModal jobId={jobId} applicantData={applicantData} />
                                </div>
                            </div>

                            {/* Info pills */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                                <div className="p-3 rounded-xl bg-muted/40 space-y-1">
                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> Location
                                    </p>
                                    <p className="text-sm font-medium">{job.location || "Remote"}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/40 space-y-1">
                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                        <Globe className="h-3 w-3" /> Job Mode
                                    </p>
                                    <p className="text-sm font-medium capitalize">{job.jobType || "—"}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/40 space-y-1">
                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                        <IndianRupee className="h-3 w-3" /> Salary
                                    </p>
                                    <p className="text-sm font-medium">
                                        {job.minSalary 
                                            ? `₹${formatSalary(job.minSalary)} – ₹${formatSalary(job.maxSalary || 0)}` 
                                            : "Not disclosed"}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/40 space-y-1">
                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Posted
                                    </p>
                                    <p className="text-sm font-medium">{format(new Date(job.createdAt), "MMM d, yyyy")}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description Card */}
                    <Card className="border-0 card-shadow">
                        <CardContent className="p-6 sm:p-8">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                Job Description
                            </h2>
                            <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
                                {job.description}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    {(job.experience || job.minEducation || job.jobLevel) && (
                        <Card className="border-0 card-shadow">
                            <CardContent className="p-6 sm:p-8">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    Requirements
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {job.jobLevel && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <TrendingUp className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-muted-foreground">Level</p>
                                                <p className="text-sm font-medium capitalize">{job.jobLevel}</p>
                                            </div>
                                        </div>
                                    )}
                                    {job.minEducation && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <GraduationCap className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-muted-foreground">Education</p>
                                                <p className="text-sm font-medium capitalize">{job.minEducation}</p>
                                            </div>
                                        </div>
                                    )}
                                    {job.experience && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Briefcase className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-muted-foreground">Experience</p>
                                                <p className="text-sm font-medium">{job.experience}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Skills & Tags */}
                    {job.tags && (
                        <Card className="border-0 card-shadow">
                            <CardContent className="p-6 sm:p-8">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-primary" />
                                    Skills & Tags
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {job.tags.split(",").map((tag: string) => (
                                        <Badge key={tag} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-0">
                                            {tag.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* ─── SIDEBAR ─────────────────────────────────── */}
                <div className="space-y-6">
                    {/* Company card */}
                    <Card className="border-0 card-shadow">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold text-base flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" />
                                About the Company
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center border overflow-hidden shrink-0">
                                    {employer?.avatarUrl ? (
                                        <img src={employer.avatarUrl} alt={employer.name || ""} className="h-full w-full object-cover" />
                                    ) : (
                                        <Building2 className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold">{employer?.name || "Anonymous"}</p>
                                    {employer?.organizationType && (
                                        <p className="text-xs text-muted-foreground capitalize">{employer.organizationType}</p>
                                    )}
                                </div>
                            </div>

                            {employer?.description && (
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                    {employer.description}
                                </p>
                            )}

                            <Separator />

                            <div className="space-y-3 text-sm">
                                {employer?.location && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <MapPin className="h-4 w-4 shrink-0" />
                                        <span>{employer.location}</span>
                                    </div>
                                )}
                                {employer?.teamSize && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Users className="h-4 w-4 shrink-0" />
                                        <span>{employer.teamSize} employees</span>
                                    </div>
                                )}
                                {employer?.yearOfEstablishment && (
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Calendar className="h-4 w-4 shrink-0" />
                                        <span>Founded {employer.yearOfEstablishment}</span>
                                    </div>
                                )}
                                {employer?.websiteUrl && (
                                    <a 
                                        href={employer.websiteUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex items-center gap-3 text-primary hover:underline"
                                    >
                                        <Globe className="h-4 w-4 shrink-0" />
                                        <span>Visit Website</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA card */}
                    <Card className="border-0 overflow-hidden">
                        <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary p-6 text-white text-center">
                            <div className="mx-auto h-12 w-12 rounded-full bg-white/15 flex items-center justify-center mb-3">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-lg mb-1">Interested?</h4>
                            <p className="text-sm text-white/70 mb-5">
                                Submit your application before this role gets filled.
                            </p>
                            <div className="w-full relative z-20">
                                <ApplyModal jobId={jobId} applicantData={applicantData} />
                            </div>
                        </div>
                    </Card>

                    {/* Expiry info */}
                    {job.expiresAt && (
                        <Card className="border-0 card-shadow bg-amber-50/50 dark:bg-amber-950/10">
                            <CardContent className="p-4 flex items-center gap-3">
                                <Clock className="h-5 w-5 text-amber-600 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Application Deadline</p>
                                    <p className="text-xs text-amber-600/70">{format(new Date(job.expiresAt), "MMMM d, yyyy")}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
