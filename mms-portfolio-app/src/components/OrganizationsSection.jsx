import { useState } from "react";
import { useData } from "../contexts/DataContext";
import organizationLogo from "../assets/info/organization.png";
import SectionWrapper from "./SectionWrapper";
import OrganizationCard from "./cards/OrganizationCard";
import PopupModal from "./PopupModal";

const OrganizationsSection = () => {
  const { data } = useData();
  const { organizations } = data;
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const icon = (
    <img
      src={organizationLogo}
      alt="Organizations"
      className="h-8 w-8 object-contain"
    />
  );

  const handleCardClick = (org) => {
    setSelectedOrganization(org);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrganization(null);
  };

  return (
    <>
      <SectionWrapper
        id="organizations"
        title="Organizations"
        icon={icon}
        description="My involvement in various organizations and communities that have shaped my professional growth."
        nextSectionId="education"
        prevSectionId="experience"
        showArrow={false}
      >
        <div className="grid md:grid-cols-2 gap-6">
          {organizations.map((org) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              onClick={() => handleCardClick(org)}
            />
          ))}
        </div>
      </SectionWrapper>

      <PopupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedOrganization?.title}
      >
        {selectedOrganization && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-stellar-blue text-xl font-semibold">
                  {selectedOrganization.organization}
                </p>
              </div>

              <p className="text-nebula-mint/80 leading-relaxed text-lg">
                {selectedOrganization.description}
              </p>
            </div>
          </div>
        )}
      </PopupModal>
    </>
  );
};

export default OrganizationsSection;
