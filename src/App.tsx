import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ApplicantDashboard from "./pages/applicant/Dashboard";
import JobDetail from "./pages/applicant/JobDetail";
import Applications from "./pages/applicant/Applications";
import ApplicantProfile from "./pages/applicant/Profile";
import EmployerDashboard from "./pages/employer/Dashboard";
import PostJob from "./pages/employer/PostJob";
import MyJobs from "./pages/employer/MyJobs";
import JobDetailEmployer from "./pages/employer/JobDetailEmployer";
import Candidates from "./pages/employer/Candidates";
import CandidateDetail from "./pages/employer/CandidateDetail";
import EmployerSettings from "./pages/employer/EmployerSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* Applicant */}
          <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
          <Route path="/applicant/jobs" element={<ApplicantDashboard />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/applicant/applications" element={<Applications />} />
          <Route path="/applicant/profile" element={<ApplicantProfile />} />
          {/* Employer */}
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/employer/my-jobs" element={<MyJobs />} />
          <Route path="/employer/my-jobs/:id" element={<JobDetailEmployer />} />
          <Route path="/employer/candidates" element={<Candidates />} />
          <Route path="/employer/candidates/:id" element={<CandidateDetail />} />
          <Route path="/employer/settings" element={<EmployerSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
