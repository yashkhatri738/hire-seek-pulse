"use client";

import React, { useState, useCallback, useEffect, memo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { format } from "date-fns";

interface JobData {
  job: any;
  employer: any;
}

interface JobDashboardClientProps {
  initialJobs: JobData[];
  initialSearch?: string;
}

// ─── Salary formatter ──────────────────────────────────────────
function formatSalary(amount: number): string {
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
  return amount.toLocaleString();
}

// ─── Time ago helper ───────────────────────────────────────────
function timeAgo(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return format(date, "MMM d, yyyy");
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
              className="h-4 w-4 rounded data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary font-semibold"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-destructive hover:text-destructive h-7 px-2"
          >
            Reset
          </Button>
        )}
      </div>

      <Separator className="bg-border/60" />

      {/* Location search */}
      <div className="space-y-2.5">
        <h4 className="text-[13px] font-semibold flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Location
        </h4>
        <Input
          placeholder="City or region..."
          value={filters.location}
          onChange={(e) => onFilterChange("location", e.target.value)}
          className="h-9 text-sm rounded-lg"
        />
      </div>

      <Separator className="bg-border/60" />

      <FilterCheckboxGroup
        title="Job Mode"
        options={JOB_TYPE}
        selected={filters.jobType}
        onChange={(v) => onFilterChange("jobType", v)}
        icon={<Globe className="h-3.5 w-3.5 text-primary" />}
      />

      <Separator className="bg-border/60" />

      <FilterCheckboxGroup
        title="Work Type"
        options={WORK_TYPE}
        selected={filters.workType}
        onChange={(v) => onFilterChange("workType", v)}
        icon={<Clock className="h-3.5 w-3.5 text-primary" />}
      />

      <Separator className="bg-border/60" />

      <FilterCheckboxGroup
        title="Experience Level"
        options={JOB_LEVEL}
        selected={filters.jobLevel}
        onChange={(v) => onFilterChange("jobLevel", v)}
        icon={<TrendingUp className="h-3.5 w-3.5 text-primary" />}
      />

      <Separator className="bg-border/60" />

      {/* Salary range */}
      <div className="space-y-3">
        <h4 className="text-[13px] font-semibold flex items-center gap-2">
          <IndianRupee className="h-3.5 w-3.5 text-primary" />
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
          <span className="bg-muted px-2 py-0.5 rounded">
            ₹{formatSalary(filters.salaryRange[0])}
          </span>
          <span className="text-[10px]">to</span>
          <span className="bg-muted px-2 py-0.5 rounded">
            ₹{formatSalary(filters.salaryRange[1])}
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
  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <Card
        className={`border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden ${
          featured ? "border-primary/25 bg-primary/[0.02]" : "border-border/60"
        }`}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex gap-4">
            {/* Company logo */}
            <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border/60 overflow-hidden">
              {employer?.avatarUrl ? (
                <img
                  src={employer.avatarUrl}
                  alt={employer.name || ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-5 w-5 text-muted-foreground/60" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[15px] leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {employer?.name || "Anonymous Company"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {featured && (
                    <Badge className="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 border-0 text-[10px] h-5 gap-1">
                      <Flame className="h-3 w-3" /> Featured
                    </Badge>
                  )}
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  <span className="text-border">·</span>
                )}
                {job.jobType && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground capitalize">
                    <Globe className="h-3 w-3" /> {job.jobType}
                  </span>
                )}
                {job.workType && (
                  <Badge
                    variant="secondary"
                    className="capitalize text-[10px] h-5 font-medium"
                  >
                    {job.workType.replace("-", " ")}
                  </Badge>
                )}
                {job.jobLevel && (
                  <Badge
                    variant="outline"
                    className="capitalize text-[10px] h-5 font-normal"
                  >
                    {job.jobLevel}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  {job.minSalary && (
                    <span className="text-sm font-semibold text-foreground flex items-center gap-0.5">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {formatSalary(job.minSalary)}
                      {job.maxSalary && ` – ${formatSalary(job.maxSalary)}`}
                      {job.salaryPeriod && (
                        <span className="text-xs font-normal text-muted-foreground ml-0.5">
                          /{job.salaryPeriod}
                        </span>
                      )}
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
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/5 text-primary/70 dark:bg-primary/10"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  {job.tags.split(",").length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      +{job.tags.split(",").length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
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
  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <Card className="min-w-[280px] border border-primary/15 hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
              {employer?.avatarUrl ? (
                <img
                  src={employer.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                {job.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {employer?.name}
              </p>
            </div>
            <Badge className="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 border-0 text-[10px] h-5 gap-0.5 shrink-0">
              <Flame className="h-3 w-3" /> Hot
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex flex-wrap gap-1.5">
              {job.jobType && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground capitalize">
                  {job.jobType}
                </span>
              )}
              {job.workType && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground capitalize">
                  {job.workType.replace("-", " ")}
                </span>
              )}
            </div>
            {job.minSalary && (
              <span className="text-xs font-semibold text-foreground">
                ₹{formatSalary(job.minSalary)}
                <span className="text-muted-foreground font-normal">
                  /{job.salaryPeriod?.charAt(0)}
                </span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
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
            Browse Jobs
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
              className="pl-10 h-10 rounded-lg"
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
                className="h-10 gap-2 shrink-0 rounded-lg"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-6">
              <SheetHeader>
                <SheetTitle>Filter Jobs</SheetTitle>
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
              <Flame className="h-4 w-4 text-amber-500" />
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
            <Card className="border border-border/60 shadow-sm">
              <CardContent className="p-4">
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
              </CardContent>
            </Card>
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
                <Badge
                  key={t}
                  variant="secondary"
                  className="gap-1 capitalize cursor-pointer hover:bg-destructive/10 hover:text-destructive text-xs"
                  onClick={() =>
                    handleFilterChange(
                      "jobType",
                      filters.jobType.filter((x) => x !== t),
                    )
                  }
                >
                  {t} <X className="h-3 w-3" />
                </Badge>
              ))}
              {filters.workType.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="gap-1 capitalize cursor-pointer hover:bg-destructive/10 hover:text-destructive text-xs"
                  onClick={() =>
                    handleFilterChange(
                      "workType",
                      filters.workType.filter((x) => x !== t),
                    )
                  }
                >
                  {t.replace("-", " ")} <X className="h-3 w-3" />
                </Badge>
              ))}
              {filters.jobLevel.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="gap-1 capitalize cursor-pointer hover:bg-destructive/10 hover:text-destructive text-xs"
                  onClick={() =>
                    handleFilterChange(
                      "jobLevel",
                      filters.jobLevel.filter((x) => x !== t),
                    )
                  }
                >
                  {t} <X className="h-3 w-3" />
                </Badge>
              ))}
              {filters.location && (
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive text-xs"
                  onClick={() => handleFilterChange("location", "")}
                >
                  {filters.location} <X className="h-3 w-3" />
                </Badge>
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
              <Card className="border border-border/60">
                <CardContent className="py-20 text-center">
                  <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No jobs found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Try adjusting your filters or search terms to discover more
                    opportunities.
                  </p>
                  {(filters.search || activeFiltersCount > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
