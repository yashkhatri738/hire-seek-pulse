import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Camera, Save } from "lucide-react";

export default function EmployerSettings() {
  return (
    <DashboardLayout role="employer" title="Settings">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 card-shadow">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold relative">
              TC
              <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-card card-shadow flex items-center justify-center">
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">TechCorp Inc.</h2>
              <p className="text-sm text-muted-foreground">Employer Account</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Company Name</label>
              <Input defaultValue="TechCorp Inc." className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Website</label>
              <Input defaultValue="https://techcorp.com" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Industry</label>
                <Input defaultValue="Technology" className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Company Size</label>
                <Input defaultValue="100-500" className="rounded-xl" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">About</label>
              <Textarea defaultValue="We are a leading technology company..." className="rounded-xl min-h-[80px]" />
            </div>
            <Button className="w-full gradient-primary text-primary-foreground border-0 h-11">
              <Save className="h-4 w-4 mr-2" /> Save Settings
            </Button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
