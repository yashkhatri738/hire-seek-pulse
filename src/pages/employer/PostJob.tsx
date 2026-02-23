import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Briefcase, FileText, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const steps = [
  { icon: Briefcase, label: "Job Details" },
  { icon: FileText, label: "Description" },
  { icon: Send, label: "Publish" },
];

export default function PostJob() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", type: "", location: "", salaryMin: "", salaryMax: "",
    description: "", skills: "", experience: "",
  });

  const update = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const handlePublish = () => {
    toast({ title: "Job Published! 🎉", description: `"${form.title || "New Job"}" is now live.` });
    setStep(0);
    setForm({ title: "", type: "", location: "", salaryMin: "", salaryMax: "", description: "", skills: "", experience: "" });
  };

  return (
    <DashboardLayout role="employer" title="Post a Job">
      <div className="max-w-xl mx-auto">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline">{s.label}</span>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 rounded ${i < step ? "gradient-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl p-6 card-shadow"
          >
            {step === 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg">Job Details</h3>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Job Title</label>
                  <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Senior Frontend Developer" className="rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Job Type</label>
                  <Select value={form.type} onValueChange={(v) => update("type", v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                  <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. San Francisco, CA" className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Min Salary</label>
                    <Input value={form.salaryMin} onChange={(e) => update("salaryMin", e.target.value)} placeholder="$80,000" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Max Salary</label>
                    <Input value={form.salaryMax} onChange={(e) => update("salaryMax", e.target.value)} placeholder="$120,000" className="rounded-xl" />
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg">Description</h3>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Job Description</label>
                  <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the role and responsibilities..." className="rounded-xl min-h-[120px]" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Skills Required</label>
                  <Input value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="React, TypeScript, Node.js" className="rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Experience Required</label>
                  <Input value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="3-5 years" className="rounded-xl" />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg">Preview & Publish</h3>
                <div className="bg-muted rounded-xl p-4 space-y-2">
                  <p className="font-semibold text-foreground">{form.title || "Job Title"}</p>
                  <p className="text-sm text-muted-foreground">{form.type || "Type"} · {form.location || "Location"}</p>
                  <p className="text-sm text-muted-foreground">{form.salaryMin && form.salaryMax ? `${form.salaryMin} – ${form.salaryMax}` : "Salary"}</p>
                  <p className="text-sm text-muted-foreground mt-2">{form.description || "No description provided."}</p>
                  {form.skills && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {form.skills.split(",").map((s) => (
                        <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-xl">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              ) : <div />}
              {step < 2 ? (
                <Button onClick={() => setStep(step + 1)} className="gradient-primary text-primary-foreground border-0 rounded-xl">
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handlePublish} className="gradient-primary text-primary-foreground border-0 rounded-xl hero-shadow">
                  <Send className="h-4 w-4 mr-1" /> Publish Job
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
