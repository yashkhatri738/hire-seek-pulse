"use client";

import React, { useState, useCallback, useTransition, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Search,
    MapPin,
    Clock,
    IndianRupee,
    Briefcase,
    Building2,
    Calendar,
    ChevronRight,
    SlidersHorizontal,
    Sparkles,
    X,
    ArrowUpRight,
    Flame,
    Filter,
    TrendingUp,
    Users,
    Globe,
    GraduationCap,
    Zap,
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

// ─── Filter Section ────────────────────────────────────────────
function FilterCheckboxGroup({
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
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                {icon}
                {title}
            </h4>
            <div className="space-y-2">
                {options.map((option) => (
                    <label
                        key={option}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
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
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="capitalize group-hover:translate-x-0.5 transition-transform">
                            {option.replace("-", " ")}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}

// ─── Sidebar Filters ───────────────────────────────────────────
function FiltersPanel({
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    Filters
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary">
                            {activeFiltersCount}
                        </Badge>
                    )}
                </h3>
                {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={onClear} className="text-xs text-muted-foreground h-7 px-2">
                        Clear all
                    </Button>
                )}
            </div>

            <Separator />

            {/* Location search */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    Location
                </h4>
                <Input
                    placeholder="City or region..."
                    value={filters.location}
                    onChange={(e) => onFilterChange("location", e.target.value)}
                    className="h-9 text-sm bg-muted/40 border-0 focus-visible:ring-1"
                />
            </div>

            <Separator />

            <FilterCheckboxGroup
                title="Job Mode"
                options={JOB_TYPE}
                selected={filters.jobType}
                onChange={(v) => onFilterChange("jobType", v)}
                icon={<Globe className="h-3.5 w-3.5 text-primary" />}
            />

            <Separator />

            <FilterCheckboxGroup
                title="Work Type"
                options={WORK_TYPE}
                selected={filters.workType}
                onChange={(v) => onFilterChange("workType", v)}
                icon={<Clock className="h-3.5 w-3.5 text-primary" />}
            />

            <Separator />

            <FilterCheckboxGroup
                title="Experience Level"
                options={JOB_LEVEL}
                selected={filters.jobLevel}
                onChange={(v) => onFilterChange("jobLevel", v)}
                icon={<TrendingUp className="h-3.5 w-3.5 text-primary" />}
            />

            <Separator />

            {/* Salary range */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
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
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>₹{formatSalary(filters.salaryRange[0])}</span>
                    <span>₹{formatSalary(filters.salaryRange[1])}</span>
                </div>
            </div>
        </div>
    );
}

// ─── Job Card ──────────────────────────────────────────────────
function JobCard({ job, employer, featured = false }: { job: any; employer: any; featured?: boolean }) {
    return (
        <Link href={`/jobs/${job.id}`} className="block group">
            <Card className={`border-0 card-shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden ${
                featured ? "ring-1 ring-primary/20 bg-primary/[0.02]" : ""
            }`}>
                <CardContent className="p-5">
                    <div className="flex gap-4">
                        {/* Company logo */}
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shrink-0 border overflow-hidden">
                            {employer?.avatarUrl ? (
                                <img src={employer.avatarUrl} alt={employer.name || ""} className="h-full w-full object-cover" />
                            ) : (
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                        {job.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        {employer?.name || "Anonymous Company"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {featured && (
                                        <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[10px] h-5 gap-1">
                                            <Flame className="h-3 w-3" /> Featured
                                        </Badge>
                                    )}
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>

                            {/* tags row */}
                            <div className="flex flex-wrap items-center gap-2">
                                {job.location && (
                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                                        <MapPin className="h-3 w-3" /> {job.location}
                                    </span>
                                )}
                                {job.jobType && (
                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full capitalize">
                                        <Globe className="h-3 w-3" /> {job.jobType}
                                    </span>
                                )}
                                {job.workType && (
                                    <Badge variant="outline" className="capitalize text-[10px] h-5 font-normal border-primary/20 text-primary">
                                        {job.workType.replace("-", " ")}
                                    </Badge>
                                )}
                                {job.jobLevel && (
                                    <Badge variant="outline" className="capitalize text-[10px] h-5 font-normal">
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
                                        <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                                            <IndianRupee className="h-3.5 w-3.5" />
                                            {formatSalary(job.minSalary)}
                                            {job.maxSalary && ` – ${formatSalary(job.maxSalary)}`}
                                            {job.salaryPeriod && (
                                                <span className="text-xs font-normal text-muted-foreground">
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
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {job.tags.split(",").slice(0, 4).map((tag: string) => (
                                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                            {tag.trim()}
                                        </span>
                                    ))}
                                    {job.tags.split(",").length > 4 && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
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
}

// ─── Featured Job Carousel Card ─────────────────────────────────
function FeaturedCard({ job, employer }: { job: any; employer: any }) {
    return (
        <Link href={`/jobs/${job.id}`} className="block group">
            <div className="relative rounded-2xl p-5 min-w-[280px] h-[180px] bg-gradient-to-br from-primary via-primary/90 to-secondary text-white overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                <div className="absolute bottom-2 left-6 w-14 h-14 rounded-full bg-white/5 blur-lg" />
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
                                {employer?.avatarUrl ? (
                                    <img src={employer.avatarUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <Building2 className="h-4 w-4" />
                                )}
                            </div>
                            <span className="text-xs text-white/70 font-medium">{employer?.name}</span>
                        </div>
                        <h4 className="font-bold text-lg leading-tight line-clamp-2">{job.title}</h4>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="flex flex-wrap gap-1.5">
                            {job.jobType && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 capitalize">{job.jobType}</span>
                            )}
                            {job.workType && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 capitalize">{job.workType.replace("-", " ")}</span>
                            )}
                        </div>
                        {job.minSalary && (
                            <span className="text-sm font-semibold">₹{formatSalary(job.minSalary)}/{job.salaryPeriod?.charAt(0)}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ═════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════
export default function JobDashboardClient({ initialJobs, initialSearch = "" }: JobDashboardClientProps) {
    const [filters, setFilters] = useState<Filters>({
        ...initialFilters,
        search: initialSearch,
    });
    const [jobs, setJobs] = useState<JobData[]>(initialJobs);
    const [isPending, startTransition] = useTransition();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Client-side filtering (since we have all jobs already)
    useEffect(() => {
        let filtered = [...initialJobs];

        // Search
        if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(({ job, employer }) =>
                job.title?.toLowerCase().includes(q) ||
                job.description?.toLowerCase().includes(q) ||
                job.tags?.toLowerCase().includes(q) ||
                employer?.name?.toLowerCase().includes(q)
            );
        }

        // Job type
        if (filters.jobType.length > 0) {
            filtered = filtered.filter(({ job }) => filters.jobType.includes(job.jobType));
        }

        // Work type
        if (filters.workType.length > 0) {
            filtered = filtered.filter(({ job }) => filters.workType.includes(job.workType));
        }

        // Job level
        if (filters.jobLevel.length > 0) {
            filtered = filtered.filter(({ job }) => filters.jobLevel.includes(job.jobLevel));
        }

        // Location
        if (filters.location) {
            const loc = filters.location.toLowerCase();
            filtered = filtered.filter(({ job }) => job.location?.toLowerCase().includes(loc));
        }

        // Salary range
        if (filters.salaryRange[0] > 0) {
            filtered = filtered.filter(({ job }) => (job.maxSalary || 0) >= filters.salaryRange[0]);
        }
        if (filters.salaryRange[1] < 5000000) {
            filtered = filtered.filter(({ job }) => (job.minSalary || 0) <= filters.salaryRange[1]);
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
            {/* ─── HERO HEADER ──────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-6 sm:p-8 text-white">
                <div className="absolute top-8 right-12 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-4 left-20 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1 text-white/70 text-sm">
                        <Sparkles className="h-4 w-4" /> Discover Opportunities
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Find Your Dream Job 🔥
                    </h1>
                    <p className="text-white/60 mt-1 text-sm max-w-md">
                        Browse through {initialJobs.length} open positions from top companies
                    </p>

                    {/* Search bar */}
                    <div className="mt-5 flex gap-3 max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by title, company, or skills..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                className="pl-10 h-11 bg-white text-foreground border-0 shadow-lg placeholder:text-muted-foreground"
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
                                <Button variant="secondary" className="h-11 gap-2 shrink-0">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filters
                                    {activeFiltersCount > 0 && (
                                        <span className="h-5 w-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
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
            </div>

            {/* ─── FEATURED CAROUSEL ───────────────────────────── */}
            {featuredJobs.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Flame className="h-5 w-5 text-amber-500" />
                            Featured Jobs
                        </h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                        {featuredJobs.map(({ job, employer }) => (
                            <FeaturedCard key={job.id} job={job} employer={employer} />
                        ))}
                    </div>
                </div>
            )}

            {/* ─── MAIN LAYOUT ────────────────────────────────── */}
            <div className="flex gap-6">
                {/* Sidebar - desktop */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <div className="sticky top-6">
                        <Card className="border-0 card-shadow">
                            <CardContent className="p-5">
                                <ScrollArea className="max-h-[calc(100vh-200px)]">
                                    <FiltersPanel
                                        filters={filters}
                                        onFilterChange={handleFilterChange}
                                        onClear={clearFilters}
                                        activeFiltersCount={activeFiltersCount}
                                    />
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
                            <span className="text-xs text-muted-foreground">Active:</span>
                            {filters.jobType.map((t) => (
                                <Badge
                                    key={t}
                                    variant="secondary"
                                    className="gap-1 capitalize cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() =>
                                        handleFilterChange("jobType", filters.jobType.filter((x) => x !== t))
                                    }
                                >
                                    {t} <X className="h-3 w-3" />
                                </Badge>
                            ))}
                            {filters.workType.map((t) => (
                                <Badge
                                    key={t}
                                    variant="secondary"
                                    className="gap-1 capitalize cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() =>
                                        handleFilterChange("workType", filters.workType.filter((x) => x !== t))
                                    }
                                >
                                    {t.replace("-", " ")} <X className="h-3 w-3" />
                                </Badge>
                            ))}
                            {filters.jobLevel.map((t) => (
                                <Badge
                                    key={t}
                                    variant="secondary"
                                    className="gap-1 capitalize cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() =>
                                        handleFilterChange("jobLevel", filters.jobLevel.filter((x) => x !== t))
                                    }
                                >
                                    {t} <X className="h-3 w-3" />
                                </Badge>
                            ))}
                            {filters.location && (
                                <Badge
                                    variant="secondary"
                                    className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
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
                            Showing <span className="font-semibold text-foreground">{jobs.length}</span> jobs
                            {filters.search && (
                                <> for &quot;<span className="font-medium text-foreground">{filters.search}</span>&quot;</>
                            )}
                        </p>
                    </div>

                    {/* Job cards list */}
                    <div className="space-y-3">
                        {jobs.length > 0 ? (
                            jobs.map(({ job, employer }) => (
                                <JobCard key={job.id} job={job} employer={employer} featured={job.isFeatured} />
                            ))
                        ) : (
                            <Card className="border-0 card-shadow">
                                <CardContent className="py-20 text-center">
                                    <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <Search className="h-7 w-7 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">No jobs found</h3>
                                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                        Try adjusting your filters or search terms to discover more opportunities.
                                    </p>
                                    {(filters.search || activeFiltersCount > 0) && (
                                        <Button variant="outline" className="mt-4" onClick={clearFilters}>
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
