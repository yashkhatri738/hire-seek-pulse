"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/** Global job search in the navbar — routes into the applicant job browser. */
export function NavSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/dashboard?q=${encodeURIComponent(q)}` : "/dashboard");
      }}
      className="hidden w-72 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 transition-colors focus-within:border-primary/40 focus-within:bg-white/[0.05] lg:flex"
    >
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search jobs..."
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
      />
    </form>
  );
}

export default NavSearch;
