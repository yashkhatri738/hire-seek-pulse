"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Briefcase,
  Users,
  TrendingUp,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypeAnimation } from "react-type-animation";

const features = [
  {
    emoji: "🔍",
    title: "Smart Job Search",
    desc: "AI-powered matching surfaces roles that fit your skills, salary expectations, and culture preferences.",
    iconBg: "bg-violet-500/10 border border-violet-500/20",
  },
  {
    emoji: "⚡",
    title: "One-Click Apply",
    desc: "Apply instantly with your saved profile. No repetitive forms — your first impression, perfected.",
    iconBg: "bg-pink-500/10 border border-pink-500/20",
  },
  {
    emoji: "👥",
    title: "Talent Pipeline",
    desc: "Employers discover top candidates effortlessly through intelligent filtering and shortlisting tools.",
    iconBg: "bg-emerald-500/10 border border-emerald-500/20",
  },
  {
    emoji: "📈",
    title: "Career Growth",
    desc: "Track your applications, get feedback, and unlock new opportunities as your profile gains traction.",
    iconBg: "bg-amber-500/10 border border-amber-500/20",
  },
];

const stats = [
  { value: "10K+", label: "Active Jobs" },
  { value: "50K+", label: "Candidates" },
  { value: "5K+", label: "Companies" },
  { value: "95%", label: "Success Rate" },
];

export default function HomeClient({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-x-hidden">
      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-48 -left-36 w-[700px] h-[700px] rounded-full bg-violet-600 opacity-[0.15] blur-[120px] animate-pulse" />
        <div className="absolute top-48 -right-24 w-[500px] h-[500px] rounded-full bg-pink-500 opacity-[0.12] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-emerald-500 opacity-[0.08] blur-[120px]" />
      </div>

      {/* ── Grid overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(108,99,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
        }}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-[#0a0a0f]/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent select-none">
            HireNest
          </span>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#stats"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Blog
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white border border-white/[0.08] hover:border-violet-500/40 bg-transparent hover:bg-white/5"
              >
                Find Jobs
              </Button>
            </Link>
            <Link
              href={
                user?.role === "employer" ? "/employer/dashboard" : "/login"
              }
            >
              <Button
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all"
              >
                Hire Talent <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-24 pb-20 px-6 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-medium mb-8 tracking-wide"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#7c3aed] animate-pulse" />
          AI-Powered Job Matching Platform
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl"
        >
          <span className="text-white block">Your Next Career</span>
          <span className="block mt-1 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent [background-size:200%_auto] animate-[shimmer_4s_linear_infinite]">
            <TypeAnimation
              sequence={[
                "Starts Here",
                2000,
                "Begins Now",
                2000,
                "Awaits You",
                2000,
                "Is One Click Away",
                2000,
              ]}
              wrapper="span"
              speed={40}
              repeat={Infinity}
            />
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-lg text-white/50 max-w-lg leading-relaxed font-light"
        >
          Connect with top companies and discover opportunities that match your
          skills. The smartest way to land your dream role.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center gap-3 mt-10"
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white border-0 shadow-xl shadow-violet-500/40 hover:shadow-violet-500/60 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Search className="mr-2 h-4 w-4" /> Find Jobs
            </Button>
          </Link>
          <Link
            href={user?.role === "employer" ? "/employer/dashboard" : "/login"}
          >
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base bg-transparent border-white/10 text-white/80 hover:bg-white/5 hover:border-violet-500/40 hover:text-white transition-all duration-200"
            >
              Post a Job <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Trust notes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-5 mt-5 text-xs text-white/30"
        >
          {["Free to sign up", "No credit card", "10K+ jobs live"].map(
            (note) => (
              <span key={note}>
                <span className="text-emerald-400 mr-1">✓</span>
                {note}
              </span>
            ),
          )}
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <div
        id="stats"
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto px-6 mb-24"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 backdrop-blur-sm hover:border-violet-500/30 hover:-translate-y-1 transition-all duration-200"
          >
            <p className="text-3xl font-extrabold bg-gradient-to-br from-white to-violet-400 bg-clip-text text-transparent">
              {stat.value}
            </p>
            <p className="text-[11px] uppercase tracking-widest text-white/40 mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 relative"
        >
          <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.15em] uppercase text-violet-400 mb-3">
            <span className="h-px w-7 bg-violet-500/40" />
            Why choose us
            <span className="h-px w-7 bg-violet-500/40" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Everything You Need to Succeed
          </h2>
          <p className="text-white/40 mt-2 text-base">
            Built for job seekers and employers who mean business
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto relative">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:border-violet-500/25 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* bottom glow line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 ${feature.iconBg}`}
              >
                {feature.emoji}
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.65 }}
          className="relative max-w-4xl mx-auto rounded-3xl p-10 md:p-16 text-center overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-950/60 via-purple-950/40 to-pink-950/30 backdrop-blur-xl"
        >
          {/* inner glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(124,58,237,0.15),transparent)] pointer-events-none" />

          <h2 className="relative text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Ready to Get Started?
          </h2>
          <p className="relative text-white/50 mt-3 max-w-md mx-auto text-base">
            Join thousands of professionals who found their dream careers
            through HireNest.
          </p>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-12 px-8 text-base bg-white hover:bg-white/90 text-violet-700 font-semibold border-0 shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started Free
              </Button>
            </Link>
            <Link
              href={
                user?.role === "employer" ? "/employer/dashboard" : "/login"
              }
            >
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base bg-transparent border-white/15 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
              >
                For Employers <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-white/30">
          © 2026 HireNest. All rights reserved.
        </div>
      </footer>

      {/* shimmer keyframe for gradient text animation */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}
