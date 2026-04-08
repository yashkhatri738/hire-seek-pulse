import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <h1 className="text-5xl font-extrabold gradient-text">404</h1>
      <p className="text-muted-foreground text-lg">Page not found</p>
      <Link href="/" className="text-primary hover:underline text-sm">
        ← Back to Home
      </Link>
    </div>
  );
}
