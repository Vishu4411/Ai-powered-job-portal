import ResumeForm from "../components/resume/ResumeForm";
import EducationForm from "../components/resume/EducationForm";
import ExperienceForm from "../components/resume/ExperienceForm";
import ProjectForm from "../components/resume/ProjectForm";
import CertificationForm from "../components/resume/CertificationForm";
import ResumePreview from "../components/resume/ResumePreview";

function ResumeBuilder() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">

      <div className="lg:col-span-2 space-y-6">
        <ResumeForm />
        <EducationForm />
        <ExperienceForm />
        <ProjectForm />
        <CertificationForm />
      </div>

      <ResumePreview />

    </div>
  );
}

export default ResumeBuilder;