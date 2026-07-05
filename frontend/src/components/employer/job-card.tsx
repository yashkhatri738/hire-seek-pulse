"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatSalary, timeAgo, humanize } from "@/lib/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MapPin,
  Clock,
  Sparkles,
  Pencil,
  Trash2,
  Loader2,
  Wallet,
} from "lucide-react";
import { deleteJob } from "@/lib/action/employer/job.action";

interface JobCardProps {
  job: {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    jobType: string | null;
    jobLevel: string | null;
    workType: string | null;
    isFeatured: boolean;
    createdAt: Date | string;
    minSalary?: number | null;
    maxSalary?: number | null;
    salaryCurrency?: string | null;
    salaryPeriod?: string | null;
  };
}

export function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const salary = formatSalary(
    job.minSalary,
    job.maxSalary,
    job.salaryCurrency,
    job.salaryPeriod,
  );

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteJob(job.id);

        if (result.status === "SUCCESS") {
          toast.success("Job deleted successfully");
          router.refresh();
        } else {
          toast.error(
            typeof result.message === "string"
              ? result.message
              : "Failed to delete job",
          );
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setShowDeleteDialog(false);
      }
    });
  };

  return (
    <>
      <Card className="group flex flex-col h-full overflow-hidden border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1 min-w-0">
              <CardTitle className="text-lg line-clamp-1 text-white transition-colors group-hover:text-violet-200">
                {job.title}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {job.location || "Remote"}
                </span>
                <span className="text-white/20">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {humanize(job.jobType)}
                </span>
                {salary && (
                  <>
                    <span className="text-white/20">·</span>
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Wallet className="h-3 w-3" /> {salary}
                    </span>
                  </>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {job.isFeatured && (
                <Badge className="border border-amber-500/20 bg-amber-500/10 text-amber-300 text-[10px]">
                  <Sparkles className="h-3 w-3 mr-0.5" /> Featured
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {job.description || "No description provided."}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.jobLevel && (
              <Badge
                variant="outline"
                className="text-[10px] font-normal border-white/[0.08] bg-white/[0.04] text-muted-foreground"
              >
                {humanize(job.jobLevel)}
              </Badge>
            )}
            {job.workType && (
              <Badge
                variant="outline"
                className="text-[10px] font-normal border-violet-500/20 bg-violet-500/10 text-violet-300"
              >
                {humanize(job.workType)}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-white/[0.06] p-4 bg-white/[0.02]">
          <span className="text-[11px] text-muted-foreground">
            Posted {timeAgo(job.createdAt)}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-xs text-muted-foreground hover:bg-violet-500/10 hover:text-violet-200"
              asChild
            >
              <Link href={`/employer/postjob/${job.id}`}>
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-xs text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
              onClick={(e) => {
                e.preventDefault();
                setShowDeleteDialog(true);
              }}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3 mr-1" />
              )}
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job
              posting &quot;{job.title}&quot; and all associated applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Job"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
