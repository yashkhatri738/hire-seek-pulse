import { motion } from "framer-motion";
import { MapPin, Clock, DollarSign, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  logo?: string;
  index?: number;
  linkPrefix?: string;
}

export function JobCard({ id, title, company, location, salary, type, posted, logo, index = 0, linkPrefix = "/jobs" }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={`${linkPrefix}/${id}`}
        className="block bg-card rounded-2xl p-4 card-shadow hover:card-shadow-hover transition-all duration-300 group"
      >
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
            {company.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{company}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            <MapPin className="h-3 w-3" /> {location}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            <DollarSign className="h-3 w-3" /> {salary}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            <Briefcase className="h-3 w-3" /> {type}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {posted}
          </span>
          <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            View Details →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
