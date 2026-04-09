import React from "react";
import { getEmployerReceivedApplications } from "@/lib/action/employer/application.action";
import { getCurrentUser } from "@/lib/action/auth.quires";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Users, Briefcase, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CandidateModal } from "./candidate-modal";

export default async function EmployerCandidatesPage() {
    const user = await getCurrentUser();
    
    if (!user || user.role !== "employer") {
        redirect("/login");
    }

    const applicationsRes = await getEmployerReceivedApplications();
    const applications = applicationsRes.data || [];

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case "applied": return "bg-blue-500/10 text-blue-600 border-blue-200";
            case "reviewing": return "bg-amber-500/10 text-amber-600 border-amber-200";
            case "shortlisted": return "bg-purple-500/10 text-purple-600 border-purple-200";
            case "rejected": return "bg-red-500/10 text-red-600 border-red-200";
            case "selected": return "bg-green-500/10 text-green-600 border-green-200";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Candidates & Applications</h1>
                    <p className="text-muted-foreground mt-1">
                        Review profiles and manage statuses of applicants who applied to your jobs.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/employer/postjob">
                        <Button variant="outline">Post New Job</Button>
                    </Link>
                    <Link href="/employer/dashboard">
                        <Button className="gradient-primary text-white">Back to Dashboard</Button>
                    </Link>
                </div>
            </div>

            {applications.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">No Applications Yet</h2>
                        <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                            You haven't received any applications yet. Make sure your job posts are active and visible.
                        </p>
                        <Link href="/employer/postjob">
                            <Button className="gradient-primary">Post a Job</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="bg-card rounded-xl border card-shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Candidate</th>
                                    <th className="px-6 py-4 font-medium">Applied For</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium text-center">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {applications.map((item, index) => (
                                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                                                    {item.applicantInfo?.avatarUrl ? (
                                                        <img src={item.applicantInfo.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="font-semibold text-primary">{item.application.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-base text-foreground">{item.application.name}</p>
                                                    <p className="text-xs text-muted-foreground">{item.application.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                                                <Link href={`/employer/application/${item.job?.id}`} className="font-medium hover:text-primary transition-colors">
                                                    {item.job?.title}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 shrink-0" />
                                                {format(new Date(item.application.appliedAt), "MMM d, yyyy")}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="outline" className={`capitalize ${getStatusColor(item.application.status)}`}>
                                                {item.application.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <CandidateModal data={item} />
                                                <Link href={`/chat?receiverId=${item.userAccount?.id}`}>
                                                    <Button variant="outline">Message</Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
