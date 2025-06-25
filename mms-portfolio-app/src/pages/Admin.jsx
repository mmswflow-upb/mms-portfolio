import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import briefcaseIcon from "../assets/info/briefcase.png";
import projectIcon from "../assets/info/project.png";
import educationIcon from "../assets/info/education.png";
import certificateIcon from "../assets/info/certificate.png";
import contactIcon from "../assets/info/contact.png";
import informationIcon from "../assets/info/information.png";
import organizationIcon from "../assets/info/organization.png";
import PageLayout from "../components/PageLayout";
import AdminPersonal from "../components/admin/AdminPersonal";
import AdminExperience from "../components/admin/AdminExperience";
import AdminProjects from "../components/admin/AdminProjects";
import AdminEducation from "../components/admin/AdminEducation";
import AdminCertificates from "../components/admin/AdminCertificates";
import AdminContact from "../components/admin/AdminContact";
import AdminOrganizations from "../components/admin/AdminOrganizations";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("personal");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const adminSections = [
    { id: "personal", name: "About Me", icon: informationIcon },
    { id: "experience", name: "Experience", icon: briefcaseIcon },
    { id: "organizations", name: "Organizations", icon: organizationIcon },
    { id: "projects", name: "Projects", icon: projectIcon },
    { id: "education", name: "Education", icon: educationIcon },
    { id: "certificates", name: "Certificates", icon: certificateIcon },
    { id: "contact", name: "Contact", icon: contactIcon },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return <AdminPersonal />;
      case "experience":
        return <AdminExperience />;
      case "projects":
        return <AdminProjects />;
      case "education":
        return <AdminEducation />;
      case "certificates":
        return <AdminCertificates />;
      case "organizations":
        return <AdminOrganizations />;
      case "contact":
        return <AdminContact />;
      default:
        return <AdminPersonal />;
    }
  };

  return (
    <PageLayout isEditMode={true}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
          <p className="text-nebula-mint/60">Welcome back, {user.email}</p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {adminSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center ${
                activeSection === section.id
                  ? "bg-stellar-blue border-stellar-blue text-white"
                  : "bg-cosmic-purple/20 border-cosmic-purple/30 text-nebula-mint hover:bg-cosmic-purple/30"
              }`}
            >
              <img
                src={section.icon}
                alt={section.name}
                className="h-5 w-5 object-contain mr-2 logo-nebula-mint"
              />
              {section.name}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderSection()}

        {/* Back to Portfolio */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-nebula-mint/60 hover:text-stellar-blue transition-colors"
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </PageLayout>
  );
};

export default Admin;
