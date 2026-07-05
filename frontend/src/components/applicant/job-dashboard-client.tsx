"use client";

import React, { useState, useCallback, useEffect, memo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  MapPin,
  Clock,
  IndianRupee,
  Building2,
  SlidersHorizontal,
  X,
  ArrowUpRight,
  Flame,
  Filter,
  TrendingUp,
  Globe,
  Briefcase,
} from "lucide-react";
import { JOB_TYPE, WORK_TYPE, JOB_LEVEL } from "@/config/constants";
import { formatSalary, timeAgo } from "@/lib/ui";

interface JobData {
  job: any;
  employer: any;
}

interface JobDashboardClientProps {
  initialJobs: JobData[];
  initialSearch?: string;
}

// ─── Compact bound formatter (for the salary slider labels only) ──
function fmtBound(amount: number): string {
  if (amount >= 1_000_000)
    return `${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)}K`;
  return amount.toLocaleString();
}

// ─── Filter state type ─────────────────────────────────────────
interface Filters {
  search: string;
  jobType: string[];
  workType: string[];
  jobLevel: string[];
  location: string;
  salaryRange: [number, number];
}

const initialFilters: Filters = {
  search: "",
  jobType: [],
  workType: [],
  jobLevel: [],
  location: "",
  salaryRange: [0, 5000000],
};

// ─── Filter Checkbox Group (memoized) ──────────────────────────
const FilterCheckboxGroup = memo(function FilterCheckboxGroup({
  title,
  options,
  selected,
  onChange,
  icon,
}: {
  title: string;
  options: readonly string[];
  selected: string[];
  onChange: (value: string[]) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <h4 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
        {icon}
        {title}
      </h4>
      <div className="space-y-1.5">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1 rounded-md"
          >
            <Checkbox
              checked={selected.includes(option)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...selected, option]);
                } else {
                  onChange(selected.filter((s) => s !== option));
                }
              }}
              className="h-4 w-4 rounded border-white/20 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
            />
            <span className="capitalize">{option.replace("-", " ")}</span>
          </label>
        ))}
      </div>
    </div>
  );
});

// ─── Sidebar Filters (memoized to prevent re-renders) ──────────
const FiltersPanel = memo(function FiltersPanel({
  filters,
  onFilterChange,
  onClear,
  activeFiltersCount,
}: {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: any) => void;
  onClear: () => void;
  activeFiltersCount: number;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
          <Filter className="h-4 w-4 text-violet-400" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="h-5 px-1.5 text-[10px] border-0 bg-violet-500/15 text-violet-300 font-semibold">
              {activeFiltersCount}
            </Badge>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-rose-300 h-7 px-2"
          >
            Reset
          </Button>
        )}
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Location search */}
      <div className="space-y-2.5">
        <h4 className="text-[13px] font-semibold flex items-center gap-2 text-foreground">
          <MapPin className="h-3.5 w-3.5 text-violet-400" />
          Location
        </h4>
        <Input
          placeholder="City or region..."
          value={filters.location}
          onChange={(e) => onFilterChange("location", e.target.value)}
          className="h-9 text-sm rounded-lg border-white/10 bg-white/[0.03] focus-visible:ring-violet-500/40"
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      <FilterCheckboxGroup
        title="Job Mode"
        options={JOB_TYPE}
        selected={filters.jobType}
        onChange={(v) => onFilterChange("jobType", v)}
        icon={<Globe className="h-3.5 w-3.5 text-violet-400" />}
      />

      <Separator className="bg-white/[0.06]" />

      <FilterCheckboxGroup
        title="Work Type"
        options={WORK_TYPE}
        selected={filters.workType}
        onChange={(v) => onFilterChange("workType", v)}
        icon={<Clock className="h-3.5 w-3.5 text-violet-400" />}
      />

      <Separator className="bg-white/[0.06]" />

      <FilterCheckboxGroup
        title="Experience Level"
        options={JOB_LEVEL}
        selected={filters.jobLevel}
        onChange={(v) => onFilterChange("jobLevel", v)}
        icon={<TrendingUp className="h-3.5 w-3.5 text-violet-400" />}
      />

      <Separator className="bg-white/[0.06]" />

      {/* Salary range */}
      <div className="space-y-3">
        <h4 className="text-[13px] font-semibold flex items-center gap-2 text-foreground">
          <IndianRupee className="h-3.5 w-3.5 text-violet-400" />
          Salary Range
        </h4>
        <Slider
          value={filters.salaryRange}
          onValueChange={(v) => onFilterChange("salaryRange", v)}
          min={0}
          max={5000000}
          step={50000}
          className="py-2"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5">
            ₹{fmtBound(filters.salaryRange[0])}
          </span>
          <span className="text-[10px]">to</span>
          <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5">
            ₹{fmtBound(filters.salaryRange[1])}
          </span>
        </div>
      </div>
    </div>
  );
});

// ─── Job Card ──────────────────────────────────────────────────
const JobCard = memo(function JobCard({
  job,
  employer,
  featured = false,
}: {
  job: any;
  employer: any;
  featured?: boolean;
}) {
  const salary = formatSalary(
    job.minSalary,
    job.maxSalary,
    job.salaryCurrency,
    job.salaryPeriod,
  );

  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <div
        className={`glass-card rounded-2xl overflow-hidden hover:-translate-y-0.5 ${
          featured ? "border-amber-500/20" : ""
        }`}
      >
        <div className="p-4 sm:p-5">
          <div className="flex gap-4">
            {/* Company logo */}
            <div className="h-11 w-11 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 border border-white/[0.08] overflow-hidden">
              {employer?.avatarUrl ? (
                <img
                  src={employer.avatarUrl}
                  alt={employer.name || ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[15px] leading-tight text-foreground group-hover:text-violet-300 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {employer?.name || "Anonymous Company"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {featured && (
                    <Badge className="border-0 bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/25 text-[10px] h-5 gap-1">
                      <Flame className="h-3 w-3" /> Featured
                    </Badge>
                  )}
                  <ArrowUpRight className="h-4 w-4 text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Meta tags row */}
              <div className="flex flex-wrap items-center gap-1.5">
                {job.location && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </span>
                )}
                {job.location && job.jobType && (
                  <span className="text-white/20">·</span>
                )}
                {job.jobType && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground capitalize">
                    <Globe className="h-3 w-3" /> {job.jobType}
                  </span>
                )}
                {job.workType && (
                  <span className="capitalize text-[10px] font-medium rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-muted-foreground">
                    {job.workType.replace("-", " ")}
                  </span>
                )}
                {job.jobLevel && (
                  <span className="capitalize text-[10px] rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-muted-foreground">
                    {job.jobLevel}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  {salary && (
                    <span className="text-sm font-semibold text-foreground">
                      {salary}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {timeAgo(job.createdAt)}
                </span>
              </div>

              {/* Skill tags */}
              {job.tags && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {job.tags
                    .split(",")
                    .slice(0, 4)
                    .map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-violet-500/15 bg-violet-500/10 text-violet-300"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  {job.tags.split(",").length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md border border-white/[0.08] bg-white/[0.04] text-muted-foreground">
                      +{job.tags.split(",").length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

// ─── Featured Job Card ──────────────────────────────────────────
const FeaturedCard = memo(function FeaturedCard({
  job,
  employer,
}: {
  job: any;
  employer: any;
}) {
  const salary = formatSalary(
    job.minSalary,
    job.maxSalary,
    job.salaryCurrency,
    job.salaryPeriod,
  );

  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <div className="glass-card min-w-[280px] rounded-2xl overflow-hidden hover:-translate-y-0.5">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center shrink-0 overflow-hidden">
              {employer?.avatarUrl ? (
                <img
                  src={employer.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-4 w-4 text-violet-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm leading-tight line-clamp-1 text-foreground group-hover:text-violet-300 transition-colors">
                {job.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {employer?.name}
              </p>
            </div>
            <Badge className="border-0 bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/25 text-[10px] h-5 gap-0.5 shrink-0">
              <Flame className="h-3 w-3" /> Hot
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
            <div className="flex flex-wrap gap-1.5">
              {job.jobType && (
                <span className="text-[10px] px-2 py-0.5 rounded-md border border-white/[0.08] bg-white/[0.04] text-muted-foreground capitalize">
                  {job.jobType}
                </span>
              )}
              {job.workType && (
                <span className="text-[10px] px-2 py-0.5 rounded-md border border-white/[0.08] bg-white/[0.04] text-muted-foreground capitalize">
                  {job.workType.replace("-", " ")}
                </span>
              )}
            </div>
            {salary && (
              <span className="text-xs font-semibold text-foreground">
                {salary}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

// ═════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════
export default function JobDashboardClient({
  initialJobs,
  initialSearch = "",
}: JobDashboardClientProps) {
  const [filters, setFilters] = useState<Filters>({
    ...initialFilters,
    search: initialSearch,
  });
  const [jobs, setJobs] = useState<JobData[]>(initialJobs);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Client-side filtering
  useEffect(() => {
    let filtered = [...initialJobs];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        ({ job, employer }) =>
          job.title?.toLowerCase().includes(q) ||
          job.description?.toLowerCase().includes(q) ||
          job.tags?.toLowerCase().includes(q) ||
          employer?.name?.toLowerCase().includes(q),
      );
    }

    if (filters.jobType.length > 0) {
      filtered = filtered.filter(({ job }) =>
        filters.jobType.includes(job.jobType),
      );
    }

    if (filters.workType.length > 0) {
      filtered = filtered.filter(({ job }) =>
        filters.workType.includes(job.workType),
      );
    }

    if (filters.jobLevel.length > 0) {
      filtered = filtered.filter(({ job }) =>
        filters.jobLevel.includes(job.jobLevel),
      );
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter(({ job }) =>
        job.location?.toLowerCase().includes(loc),
      );
    }

    if (filters.salaryRange[0] > 0) {
      filtered = filtered.filter(
        ({ job }) => (job.maxSalary || 0) >= filters.salaryRange[0],
      );
    }
    if (filters.salaryRange[1] < 5000000) {
      filtered = filtered.filter(
        ({ job }) => (job.minSalary || 0) <= filters.salaryRange[1],
      );
    }

    setJobs(filtered);
  }, [filters, initialJobs]);

  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const activeFiltersCount = [
    filters.jobType.length > 0,
    filters.workType.length > 0,
    filters.jobLevel.length > 0,
    filters.location.length > 0,
    filters.salaryRange[0] > 0 || filters.salaryRange[1] < 5000000,
  ].filter(Boolean).length;

  const featuredJobs = initialJobs.filter(({ job }) => job.isFeatured);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* ─── HEADER ──────────────────────────────────────── */}
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Browse <span className="gradient-text">Jobs</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {initialJobs.length} open positions from top companies
          </p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, company, or skills..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10 h-10 rounded-lg border-white/10 bg-white/[0.03] focus-visible:ring-violet-500/40"
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => handleFilterChange("search", "")}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* Mobile filter toggle */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="outline"
                className="h-10 gap-2 shrink-0 rounded-lg border-white/10 bg-transparent hover:bg-white/[0.05] hover:border-violet-500/40"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="h-5 w-5 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-semibold">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 p-6 border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl"
            >
              <SheetHeader>
                <SheetTitle className="text-foreground">Filter Jobs</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)] mt-4 pr-3">
                <FiltersPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClear={clearFilters}
                  activeFiltersCount={activeFiltersCount}
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* ─── FEATURED CAROUSEL ───────────────────────────── */}
      {featuredJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
              <Flame className="h-4 w-4 text-amber-400" />
              Featured
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {featuredJobs.map(({ job, employer }) => (
              <FeaturedCard key={job.id} job={job} employer={employer} />
            ))}
          </div>
        </div>
      )}

      {/* ─── MAIN LAYOUT ────────────────────────────────── */}
      <div className="flex gap-6">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-6">
            <div className="glass-card rounded-2xl">
              <div className="p-4">
                <ScrollArea className="h-[calc(100vh-180px)]">
                  <div className="pr-3">
                    <FiltersPanel
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onClear={clearFilters}
                      activeFiltersCount={activeFiltersCount}
                    />
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </aside>

        {/* Job listing */}
        <main className="flex-1 min-w-0">
          {/* Active filter pills */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground font-medium">
                Active:
              </span>
              {filters.jobType.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="inline-flex items-center gap-1 capitalize cursor-pointer text-xs rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-muted-foreground hover:border-rose-500/40 hover:text-rose-300 transition-colors"
                  onClick={() =>
                    handleFilterChange(
                      "jobType",
                      filters.jobType.filter((x) => x !== t),
                    )
                  }
                >
                  {t} <X className="h-3 w-3" />
                </button>
              ))}
              {filters.workType.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="inline-flex items-center gap-1 capitalize cursor-pointer text-xs rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-muted-foreground hover:border-rose-500/40 hover:text-rose-300 transition-colors"
                  onClick={() =>
                    handleFilterChange(
                      "workType",
                      filters.workType.filter((x) => x !== t),
                    )
                  }
                >
                  {t.replace("-", " ")} <X className="h-3 w-3" />
                </button>
              ))}
              {filters.jobLevel.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="inline-flex items-center gap-1 capitalize cursor-pointer text-xs rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-muted-foreground hover:border-rose-500/40 hover:text-rose-300 transition-colors"
                  onClick={() =>
                    handleFilterChange(
                      "jobLevel",
                      filters.jobLevel.filter((x) => x !== t),
                    )
                  }
                >
                  {t} <X className="h-3 w-3" />
                </button>
              ))}
              {filters.location && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 cursor-pointer text-xs rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-muted-foreground hover:border-rose-500/40 hover:text-rose-300 transition-colors"
                  onClick={() => handleFilterChange("location", "")}
                >
                  {filters.location} <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {jobs.length}
              </span>{" "}
              jobs
              {filters.search && (
                <>
                  {" "}
                  for &quot;
                  <span className="font-medium text-foreground">
                    {filters.search}
                  </span>
                  &quot;
                </>
              )}
            </p>
          </div>

          {/* Job cards list */}
          <div className="space-y-3">
            {jobs.length > 0 ? (
              jobs.map(({ job, employer }) => (
                <JobCard
                  key={job.id}
                  job={job}
                  employer={employer}
                  featured={job.isFeatured}
                />
              ))
            ) : (
              <div className="glass-card rounded-2xl">
                <div className="py-20 text-center">
                  <div className="mx-auto h-14 w-14 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1 text-foreground">
                    No jobs found
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Try adjusting your filters or search terms to discover more
                    opportunities.
                  </p>
                  {(filters.search || activeFiltersCount > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-white/10 bg-transparent hover:bg-white/[0.05] hover:border-violet-500/40"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
