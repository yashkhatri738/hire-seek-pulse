import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppBackground } from "@/components/app-background";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background p-6 overflow-hidden">
      <AppBackground />

      <div className="glass-card card-shadow relative z-10 flex flex-col items-center gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-8 py-12 text-center backdrop-blur sm:px-16">
        <h1 className="gradient-text text-7xl font-extrabold tracking-tight sm:text-8xl">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Page not found
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border-0 bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/30 transition-all hover:from-violet-500 hover:to-purple-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
      </div>
    </div>
  );
}
