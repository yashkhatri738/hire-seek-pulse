import React from "react";
import { getJobsByEmployer } from "@/lib/action/employer/job.action";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

const ApplicationPage = async () => {
    const jobs = await getJobsByEmployer();

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Posted Jobs</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        You haven't posted any jobs yet.
                    </div>
                ) : (
                    jobs.map(({ job }) => (
                        <Card key={job.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl line-clamp-1">{job.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <span>{job.jobType}</span>
                                            <span>•</span>
                                            <span>{job.location}</span>
                                        </CardDescription>
                                    </div>
                                    {job.isFeatured && (
                                        <Badge variant="secondary">Featured</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {job.description || "No description provided."}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {job.jobLevel && <Badge variant="outline">{job.jobLevel}</Badge>}
                                    {job.workType && <Badge variant="outline">{job.workType}</Badge>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center border-t p-4">
                                <span className="text-xs text-muted-foreground">
                                    Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                                </span>
                                <Button asChild size="sm">
                                    <Link href={`/employer/application/${job.id}`}>
                                        View Details
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ApplicationPage;