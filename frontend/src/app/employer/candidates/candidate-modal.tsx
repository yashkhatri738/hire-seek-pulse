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
import { statusStyle } from "@/lib/ui";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Phone,
  ExternalLink,
  GraduationCap,
  MapPin,
  Briefcase,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CandidateModalProps {
  data: any; // { application, job, applicantInfo, userAccount }
}

export function CandidateModal({ data }: CandidateModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { application, job, applicantInfo, userAccount } = data;
  const st = statusStyle(application.status);

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
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto border-white/10 bg-transparent hover:bg-white/[0.05]"
        >
          View Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto glass-strong border-white/[0.08]">
        <DialogHeader>
          <div className="flex justify-between items-start gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                {application.name}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Applied for{" "}
                <span className="font-semibold text-violet-300">
                  {job.title}
                </span>
              </DialogDescription>
            </div>
            <Badge className={`border-0 text-sm font-medium px-3 py-1 ${st.badge}`}>
              {st.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Sidebar / Quick Info */}
          <div className="md:col-span-1 space-y-5">
            <div className="h-32 w-full rounded-xl bg-white/[0.04] overflow-hidden flex items-center justify-center border border-white/[0.08]">
              {applicantInfo?.avatarUrl ? (
                <img
                  src={applicantInfo.avatarUrl}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-violet-300 text-4xl font-semibold">
                  {application.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-white border-b border-white/[0.08] pb-1">
                Contact Info
              </h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />{" "}
                <span className="break-all">{application.email}</span>
              </div>
              {application.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />{" "}
                  <span>{application.phoneNumber}</span>
                </div>
              )}
              {applicantInfo?.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />{" "}
                  <span>{applicantInfo.location}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-white border-b border-white/[0.08] pb-1">
                Links
              </h4>
              {application.linkedInUrl && (
                <a
                  href={application.linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-violet-300 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {application.githubUrl && (
                <a
                  href={application.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-violet-300 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" /> GitHub
                </a>
              )}
              {application.portfolioUrl && (
                <a
                  href={application.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-violet-300 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" /> Portfolio
                </a>
              )}
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-violet-300 hover:underline font-semibold mt-2"
              >
                <ExternalLink className="h-4 w-4" /> Open Resume
              </a>
            </div>
          </div>

          {/* Main Content Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-white">
                <Briefcase className="h-4 w-4 text-violet-300" /> Profile Bio
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {applicantInfo?.biography ||
                  "No biography provided by the candidate."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                <p className="text-[11px] text-muted-foreground uppercase opacity-70">
                  Experience Claimed
                </p>
                <p className="font-medium text-sm mt-1 text-white">
                  {application.yearsOfExperience ||
                    applicantInfo?.experience ||
                    "Not disclosed"}
                </p>
              </div>
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                <p className="text-[11px] text-muted-foreground uppercase opacity-70">
                  Education
                </p>
                <p className="font-medium text-sm mt-1 text-white">
                  {applicantInfo?.education || "Not disclosed"}
                </p>
              </div>
            </div>

            {applicantInfo?.skills && (
              <div>
                <h4 className="font-semibold mb-2 text-sm text-white">
                  Top Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {applicantInfo.skills.split(",").map((skill: string) => (
                    <Badge
                      key={skill}
                      className="bg-violet-500/10 text-violet-300 border border-violet-500/20 font-normal"
                    >
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {application.coverLetter && (
              <div>
                <h4 className="font-semibold mb-2 text-sm text-white border-b border-white/[0.08] pb-1">
                  Cover Letter
                </h4>
                <div className="text-sm text-muted-foreground bg-white/[0.03] p-4 rounded-xl border border-white/[0.06] whitespace-pre-wrap leading-relaxed">
                  {application.coverLetter}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-white/[0.08] mt-4">
          {isLoading ? (
            <Button disabled className="w-full sm:w-auto">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-rose-500/20 bg-transparent text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                onClick={() => handleStatusChange("rejected")}
              >
                Reject Candidate
              </Button>
              <Button
                variant="outline"
                className="border-amber-500/20 bg-transparent text-amber-300 hover:bg-amber-500/10 hover:text-amber-200"
                onClick={() => handleStatusChange("reviewing")}
              >
                Mark Reviewing
              </Button>
              <Button
                className="border-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-500"
                onClick={() => handleStatusChange("shortlisted")}
              >
                Shortlist / Interview
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
