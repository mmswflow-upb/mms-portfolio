import { useData } from "../contexts/DataContext";
import PageLayout from "../components/PageLayout";
import PersonalSection from "../components/PersonalSection";
import ExperienceSection from "../components/ExperienceSection";
import OrganizationsSection from "../components/OrganizationsSection";
import EducationSection from "../components/EducationSection";
import ProjectsSection from "../components/ProjectsSection";
import CertificatesSection from "../components/CertificatesSection";
import ContactSection from "../components/ContactSection";

const Home = () => {
  const { isLoading } = useData();

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-stellar-blue mx-auto"></div>
            <p className="text-nebula-mint/60">Loading portfolio...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PersonalSection />
      <ExperienceSection />
      <OrganizationsSection />
      <EducationSection />
      <ProjectsSection />
      <CertificatesSection />
      <ContactSection />
    </PageLayout>
  );
};

export default Home;
