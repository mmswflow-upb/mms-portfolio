import PageLayout from "../components/PageLayout";
import PersonalSection from "../components/PersonalSection";
import ExperienceSection from "../components/ExperienceSection";
import OrganizationsSection from "../components/OrganizationsSection";
import EducationSection from "../components/EducationSection";
import ProjectsSection from "../components/ProjectsSection";
import CertificatesSection from "../components/CertificatesSection";
import ContactSection from "../components/ContactSection";

const Home = () => {
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
