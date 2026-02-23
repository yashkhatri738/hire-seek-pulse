import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Camera, Save } from "lucide-react";

export default function ApplicantProfile() {
  return (
    <DashboardLayout role="applicant" title="Profile">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 card-shadow">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Profile Completion</span>
              <span className="font-medium text-primary">65%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-primary rounded-full transition-all" style={{ width: "65%" }} />
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold relative">
              JD
              <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-card card-shadow flex items-center justify-center">
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">John Doe</h2>
              <p className="text-sm text-muted-foreground">john.doe@email.com</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">First Name</label>
                <Input defaultValue="John" className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Last Name</label>
                <Input defaultValue="Doe" className="rounded-xl" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Skills</label>
              <Input defaultValue="React, TypeScript, Node.js, Python" className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
              <Textarea defaultValue="Full-stack developer with 5 years of experience..." className="rounded-xl min-h-[80px]" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Portfolio Link</label>
              <Input defaultValue="https://johndoe.dev" className="rounded-xl" />
            </div>
            <Button className="w-full gradient-primary text-primary-foreground border-0 h-11">
              <Save className="h-4 w-4 mr-2" /> Save Profile
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
