import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockCandidates } from "@/data/mockData";
import { ArrowLeft, CheckCircle, XCircle, Mail, MessageSquare, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

export default function CandidateDetail() {
  const { id } = useParams();
  const candidate = mockCandidates.find((c) => c.id === id);

  if (!candidate) {
    return (
      <DashboardLayout role="employer" title="Not Found">
        <p className="text-center py-16 text-muted-foreground">Candidate not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employer" title={candidate.name}>
      <div className="max-w-2xl mx-auto">
        <Link to="/employer/candidates" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 card-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {candidate.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{candidate.name}</h2>
              <p className="text-sm text-muted-foreground">{candidate.experience} experience</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Applied For</h3>
              <p className="text-foreground font-medium">{candidate.appliedFor}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s) => (
                  <span key={s} className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Resume</h3>
              <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                <ExternalLink className="h-4 w-4" /> View Resume (PDF)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-6">
            <Button onClick={() => toast({ title: "Approved for Interview! ✅" })} className="gradient-primary text-primary-foreground border-0 rounded-xl">
              <CheckCircle className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "Candidate Rejected" })} className="rounded-xl text-destructive">
              <XCircle className="h-4 w-4 mr-1" /> Reject
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Mail className="h-4 w-4 mr-1" /> Email
            </Button>
            <Button variant="outline" className="rounded-xl">
              <MessageSquare className="h-4 w-4 mr-1" /> Message
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
