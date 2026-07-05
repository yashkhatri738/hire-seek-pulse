import Link from "next/link";
import { AppBackground } from "@/components/app-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <AppBackground />
      <Link
        href="/"
        className="absolute left-6 top-6 z-20 text-lg font-bold tracking-tight gradient-text"
      >
        HireNest
      </Link>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
