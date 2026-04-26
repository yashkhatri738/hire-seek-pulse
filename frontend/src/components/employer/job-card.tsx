"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { MapPin, Clock, Sparkles, Pencil, Trash2, Loader2 } from "lucide-react";
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
  };
}

export function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setShowDeleteDialog(false);
      }
    });
  };

  return (
    <>
      <Card className="flex flex-col h-full border card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-0.5 overflow-hidden group">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1 min-w-0">
              <CardTitle className="text-lg line-clamp-1">
                {job.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {job.location || "Remote"}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 capitalize">
                  <Clock className="h-3 w-3" /> {job.jobType}
                </span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {job.isFeatured && (
                <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[10px]">
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
                className="text-[10px] capitalize font-normal"
              >
                {job.jobLevel}
              </Badge>
            )}
            {job.workType && (
              <Badge
                variant="outline"
                className="text-[10px] capitalize font-normal border-primary/20 text-primary"
              >
                {job.workType.replace("-", " ")}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-border/60 p-4 bg-muted/20">
          <span className="text-[11px] text-muted-foreground">
            Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-xs hover:bg-primary hover:text-primary-foreground"
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
              className="h-8 px-3 text-xs hover:bg-destructive hover:text-destructive-foreground"
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
