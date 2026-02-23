import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockJobs } from "@/data/mockData";
import { MapPin, DollarSign, Briefcase, Clock, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function JobDetail() {
  const { id } = useParams();
  const job = mockJobs.find((j) => j.id === id);
  const [open, setOpen] = useState(false);

  if (!job) {
    return (
      <DashboardLayout role="applicant" title="Job Not Found">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Job not found.</p>
          <Link to="/applicant/dashboard" className="text-primary mt-2 inline-block">← Back to jobs</Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleApply = () => {
    setOpen(false);
    toast({ title: "Application Submitted! 🎉", description: `You applied for ${job.title} at ${job.company}` });
  };

  return (
    <DashboardLayout role="applicant" title={job.title}>
      <div className="max-w-2xl mx-auto">
        <Link to="/applicant/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 card-shadow">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl shrink-0">
              {job.company.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{job.title}</h2>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full"><MapPin className="h-3 w-3" /> {job.location}</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full"><DollarSign className="h-3 w-3" /> {job.salary}</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full"><Briefcase className="h-3 w-3" /> {job.type}</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full"><Clock className="h-3 w-3" /> {job.posted}</span>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-2">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span key={skill} className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">{skill}</span>
              ))}
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mt-6 gradient-primary text-primary-foreground border-0 h-12 hero-shadow">
                <Send className="h-4 w-4 mr-2" /> Apply Now
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Apply for {job.title}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-2">
                <Input placeholder="Full Name" className="rounded-xl" />
                <Input placeholder="Email" type="email" className="rounded-xl" />
                <Input placeholder="Phone" className="rounded-xl" />
                <Textarea placeholder="Cover Letter" className="rounded-xl min-h-[100px]" />
                <Input placeholder="Portfolio Link (optional)" className="rounded-xl" />
                <Button onClick={handleApply} className="gradient-primary text-primary-foreground border-0 h-11">
                  Submit Application
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
