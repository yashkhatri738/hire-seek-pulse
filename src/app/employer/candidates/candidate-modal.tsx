"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { updateApplicationStatus } from "@/lib/action/employer/application.action";
import { toast } from "sonner";
import { Loader2, Mail, Phone, ExternalLink, GraduationCap, MapPin, Briefcase } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CandidateModalProps {
  data: any; // { application, job, applicantInfo, userAccount }
}

export function CandidateModal({ data }: CandidateModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { application, job, applicantInfo, userAccount } = data;

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    const res = await updateApplicationStatus(application.id, newStatus);
    if (res.status === "SUCCESS") {
      toast.success(`Candidate marked as ${newStatus}`);
      setOpen(false);
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">View Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
             <div>
                <DialogTitle className="text-2xl font-bold">{application.name}</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Applied for <span className="font-semibold text-primary">{job.title}</span>
                </DialogDescription>
             </div>
             <Badge variant="outline" className="capitalize text-sm font-medium px-3 py-1 bg-muted">
                {application.status}
             </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {/* Sidebar / Quick Info */}
            <div className="md:col-span-1 space-y-5">
               <div className="h-32 w-full rounded-xl bg-muted overflow-hidden flex items-center justify-center border">
                  {applicantInfo?.avatarUrl ? (
                      <img src={applicantInfo.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                      <span className="text-muted-foreground text-4xl">{application.name.charAt(0)}</span>
                  )}
               </div>

               <div className="space-y-3">
                   <h4 className="font-semibold text-sm border-b pb-1">Contact Info</h4>
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <Mail className="h-4 w-4" /> <span className="break-all">{application.email}</span>
                   </div>
                   {application.phoneNumber && (
                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <Phone className="h-4 w-4" /> <span>{application.phoneNumber}</span>
                       </div>
                   )}
                   {applicantInfo?.location && (
                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <MapPin className="h-4 w-4" /> <span>{applicantInfo.location}</span>
                       </div>
                   )}
               </div>

               <div className="space-y-3">
                   <h4 className="font-semibold text-sm border-b pb-1">Links</h4>
                   {application.linkedInUrl && (
                       <a href={application.linkedInUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                           <ExternalLink className="h-4 w-4" /> LinkedIn
                       </a>
                   )}
                   {application.githubUrl && (
                       <a href={application.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                           <ExternalLink className="h-4 w-4" /> GitHub
                       </a>
                   )}
                   {application.portfolioUrl && (
                       <a href={application.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                           <ExternalLink className="h-4 w-4" /> Portfolio
                       </a>
                   )}
                   <a href={application.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline font-semibold mt-2">
                       <ExternalLink className="h-4 w-4" /> Open Resume
                   </a>
               </div>
            </div>

            {/* Main Content Info */}
            <div className="md:col-span-2 space-y-6">
                <div>
                   <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" /> Profile Bio
                   </h4>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                       {applicantInfo?.biography || "No biography provided by the candidate."}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-xl border">
                        <p className="text-[11px] text-muted-foreground uppercase opacity-70">Experience Claimed</p>
                        <p className="font-medium text-sm mt-1">{application.yearsOfExperience || applicantInfo?.experience || "Not disclosed"}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl border">
                        <p className="text-[11px] text-muted-foreground uppercase opacity-70">Education</p>
                        <p className="font-medium text-sm mt-1">{applicantInfo?.education || "Not disclosed"}</p>
                    </div>
                </div>

                {applicantInfo?.skills && (
                    <div>
                        <h4 className="font-semibold mb-2 text-sm">Top Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {applicantInfo.skills.split(",").map((skill: string) => (
                                <Badge variant="secondary" key={skill} className="bg-primary/10 text-primary border-0 font-normal">
                                    {skill.trim()}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {application.coverLetter && (
                    <div>
                        <h4 className="font-semibold mb-2 text-sm border-b pb-1">Cover Letter</h4>
                        <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border whitespace-pre-wrap leading-relaxed">
                            {application.coverLetter}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t mt-4">
           {isLoading ? (
               <Button disabled className="w-full sm:w-auto"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</Button>
           ) : (
               <>
                 <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleStatusChange("rejected")}>
                    Reject Candidate
                 </Button>
                 <Button variant="outline" className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10" onClick={() => handleStatusChange("reviewing")}>
                    Mark Reviewing
                 </Button>
                 <Button className="gradient-primary text-white" onClick={() => handleStatusChange("shortlisted")}>
                    Shortlist / Interview
                 </Button>
               </>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
