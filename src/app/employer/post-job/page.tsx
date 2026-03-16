import { getJobById } from "@/lib/action/employer/job.action";
import JobForm from "./jobFormPage"

const JobPage = async ({searchParams}: {searchParams: {id: string}}) => {

  const id = await searchParams;
  let initialData = null;

  if (id) {
        const jobData = await getJobById(Number(id));
        if (Array.isArray(jobData) && jobData.length > 0) {
            initialData = jobData[0];
        }
    }

  return (
    <>  
    <JobForm initialData={initialData} isEditMode={!!initialData} />
    </>
  )
}

export default JobPage;