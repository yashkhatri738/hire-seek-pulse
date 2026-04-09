import React from "react";
import { getMyApplications } from "@/lib/action/applicant/application.action";
import { getCurrentUser } from "@/lib/action/auth.quires";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Building2, MapPin, Briefcase, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ApplicantApplicationsPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== "applicant") {
        redirect("/login");
    }

    const applicationsRes = await getMyApplications();
    const applications = applicationsRes.data || [];

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case "applied": return "bg-blue-500/10 text-blue-600";
            case "reviewing": return "bg-amber-500/10 text-amber-600";
            case "shortlisted": return "bg-purple-500/10 text-purple-600";
            case "rejected": return "bg-red-500/10 text-red-600";
            case "selected": return "bg-green-500/10 text-green-600";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="max-w-[1000px] mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
                    <p className="text-muted-foreground mt-1">
                        Track and manage your submitted job applications.
                    </p>
                </div>
                <Link href="/dashboard">
                    <Button className="gradient-primary text-white">Browse More Jobs</Button>
                </Link>
            </div>

            {applications.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">No Applications Yet</h2>
                        <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                            You haven't applied to any jobs yet. Start exploring and take the next step in your career!
                        </p>
                        <Link href="/dashboard">
                            <Button className="gradient-primary">Find Jobs</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {applications.map((item, index) => (
                        <Card key={index} className="overflow-hidden card-shadow hover:card-shadow-hover transition-shadow">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <div className="p-6 flex-1 border-r">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    <Link href={`/jobs/${item.job?.id}`} className="hover:text-primary transition-colors">
                                                        {item.job?.title}
                                                    </Link>
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                    <Building2 className="h-4 w-4" />
                                                    <span>{item.employer?.name || "Anonymous Company"}</span>
                                                    <span className="hidden sm:inline px-2">•</span>
                                                    <MapPin className="h-4 w-4 hidden sm:inline" />
                                                    <span className="hidden sm:inline">{item.job?.location || "Remote"}</span>
                                                </div>
                                            </div>
                                            <Badge className={`capitalize border-0 ${getStatusColor(item.application.status)}`}>
                                                {item.application.status}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Briefcase className="h-4 w-4" />
                                                <span className="capitalize">{item.job?.jobType?.replace("-", " ")}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>Applied on {format(new Date(item.application.appliedAt), "MMM d, yyyy")}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-muted/30 p-6 md:w-64 flex flex-col justify-center gap-3">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                            Application Details
                                        </p>
                                        <div className="space-y-2">
                                            <div className="text-sm flex justify-between">
                                                <span className="text-muted-foreground">Resume</span>
                                                <a href={item.application.resumeUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">View</a>
                                            </div>
                                            {item.application.coverLetter && (
                                                <div className="text-sm flex justify-between">
                                                    <span className="text-muted-foreground">Cover Letter</span>
                                                    <span className="font-medium text-foreground">Included</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <Link href={`/chat?receiverId=${item.employer?.id}`}>
                                                <Button variant="outline">Message Employer</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
