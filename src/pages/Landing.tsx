import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Briefcase, Users, TrendingUp, ArrowRight, CheckCircle2, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: Search, title: "Smart Job Search", desc: "AI-powered matching to find your perfect role" },
  { icon: Briefcase, title: "Easy Applications", desc: "One-click apply with your saved profile" },
  { icon: Users, title: "Talent Pipeline", desc: "Employers find top candidates effortlessly" },
  { icon: TrendingUp, title: "Career Growth", desc: "Track progress and unlock new opportunities" },
];

const stats = [
  { value: "10K+", label: "Active Jobs" },
  { value: "50K+", label: "Candidates" },
  { value: "5K+", label: "Companies" },
  { value: "95%", label: "Success Rate" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="glass-strong sticky top-0 z-50 border-b">
        <div className="container flex items-center justify-between h-16">
          <span className="text-xl font-bold gradient-text">JobFlow</span>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/applicant/dashboard">
              <Button variant="ghost" size="sm">Find Jobs</Button>
            </Link>
            <Link to="/employer/dashboard">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0 hero-shadow">
                Hire Talent
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" /> AI-Powered Job Matching
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Your Next Career
              <span className="block gradient-text">Starts Here</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-lg mx-auto">
              Connect with top companies and discover opportunities that match your skills. The smartest way to find your dream job.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link to="/applicant/dashboard">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0 hero-shadow px-8 h-12 text-base">
                  Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/employer/dashboard">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  Post a Job
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            id="stats"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center bg-card rounded-2xl p-4 card-shadow">
                <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Choose JobFlow</h2>
            <p className="text-muted-foreground mt-2">Everything you need to succeed in your career</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow duration-300"
              >
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="gradient-primary rounded-3xl p-8 md:p-16 text-center hero-shadow">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 mt-4 max-w-md mx-auto">
              Join thousands of professionals who found their dream careers through JobFlow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link to="/applicant/dashboard">
                <Button size="lg" className="bg-card text-foreground hover:bg-card/90 h-12 px-8">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center">
          <span className="text-sm text-muted-foreground">© 2026 JobFlow. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
