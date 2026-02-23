export const mockJobs = [
  { id: "1", title: "Senior Frontend Developer", company: "TechFlow", location: "San Francisco, CA", salary: "$140k–$180k", type: "Full-time", posted: "2 hours ago", skills: ["React", "TypeScript", "Tailwind CSS"], description: "We're looking for a senior frontend developer to lead our design system team. You'll work on building scalable component libraries and establishing best practices across the engineering organization." },
  { id: "2", title: "Product Designer", company: "DesignLab", location: "Remote", salary: "$120k–$150k", type: "Remote", posted: "5 hours ago", skills: ["Figma", "UI/UX", "Prototyping"], description: "Join our product design team to create beautiful, intuitive interfaces for millions of users. You'll collaborate closely with engineers and product managers." },
  { id: "3", title: "Backend Engineer", company: "CloudBase", location: "New York, NY", salary: "$150k–$190k", type: "Full-time", posted: "1 day ago", skills: ["Node.js", "PostgreSQL", "AWS"], description: "Build and scale our cloud infrastructure serving millions of requests daily. Work with cutting-edge technologies in a fast-paced environment." },
  { id: "4", title: "Data Scientist", company: "AIVenture", location: "Austin, TX", salary: "$130k–$170k", type: "Full-time", posted: "2 days ago", skills: ["Python", "ML", "TensorFlow"], description: "Apply machine learning to solve real-world problems at scale. Join our growing data science team and shape our AI strategy." },
  { id: "5", title: "DevOps Engineer", company: "ScaleUp", location: "Remote", salary: "$135k–$165k", type: "Remote", posted: "3 days ago", skills: ["Docker", "Kubernetes", "CI/CD"], description: "Automate and optimize our deployment pipeline. You'll work on infrastructure as code and ensure 99.99% uptime." },
  { id: "6", title: "Mobile Developer", company: "AppCraft", location: "Seattle, WA", salary: "$125k–$160k", type: "Full-time", posted: "4 days ago", skills: ["React Native", "iOS", "Android"], description: "Build cross-platform mobile experiences that delight millions of users. Join a team passionate about mobile innovation." },
];

export const mockCandidates = [
  { id: "1", name: "Sarah Chen", experience: "5 years", skills: ["React", "TypeScript", "Node.js"], status: "New", avatar: "S", appliedFor: "Senior Frontend Developer" },
  { id: "2", name: "James Wilson", experience: "3 years", skills: ["Python", "ML", "Data Analysis"], status: "Interview", avatar: "J", appliedFor: "Data Scientist" },
  { id: "3", name: "Maria Garcia", experience: "7 years", skills: ["Figma", "UI/UX", "Design Systems"], status: "Selected", avatar: "M", appliedFor: "Product Designer" },
  { id: "4", name: "Alex Johnson", experience: "4 years", skills: ["Docker", "AWS", "Kubernetes"], status: "Pending", avatar: "A", appliedFor: "DevOps Engineer" },
  { id: "5", name: "Emily Park", experience: "6 years", skills: ["React Native", "iOS", "Swift"], status: "New", avatar: "E", appliedFor: "Mobile Developer" },
];

export const mockApplications = [
  { id: "1", jobTitle: "Senior Frontend Developer", company: "TechFlow", status: "Pending" as const, appliedDate: "Feb 20, 2026" },
  { id: "2", jobTitle: "Product Designer", company: "DesignLab", status: "Interview" as const, appliedDate: "Feb 18, 2026" },
  { id: "3", jobTitle: "Backend Engineer", company: "CloudBase", status: "Rejected" as const, appliedDate: "Feb 15, 2026" },
  { id: "4", jobTitle: "Data Scientist", company: "AIVenture", status: "Selected" as const, appliedDate: "Feb 10, 2026" },
];
