import { useState } from "react";
import { useData } from "../contexts/DataContext";
import organizationLogo from "../assets/info/organization.png";
import externalLinkIcon from "../assets/info/external-link.png";
import socialMediaIcon from "../assets/info/social-media.png";
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
            {/* Header Information */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                {selectedOrganization.image && (
                  <img
                    src={selectedOrganization.image}
                    alt={
                      selectedOrganization.organization ||
                      selectedOrganization.name
                    }
                    className="w-20 h-20 object-cover rounded-lg border border-cosmic-purple/30 flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-stellar-blue text-xl font-semibold">
                    {selectedOrganization.role || selectedOrganization.title}
                  </h3>
                  <p className="text-nebula-mint/80 text-sm">
                    {selectedOrganization.organization ||
                      selectedOrganization.name}
                  </p>
                  {(selectedOrganization.startDate ||
                    selectedOrganization.endDate) && (
                    <p className="text-nebula-mint/60 text-sm">
                      {selectedOrganization.startDate &&
                      selectedOrganization.endDate
                        ? `${selectedOrganization.startDate} - ${selectedOrganization.endDate}`
                        : selectedOrganization.startDate
                        ? `${selectedOrganization.startDate} - Present`
                        : selectedOrganization.endDate}
                    </p>
                  )}
                  {selectedOrganization.location && (
                    <p className="text-nebula-mint/60 text-sm">
                      📍 {selectedOrganization.location}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-nebula-mint">
                Description
              </h4>
              <p className="text-nebula-mint/80 leading-relaxed text-lg">
                {selectedOrganization.description}
              </p>
            </div>

            {/* Links */}
            {(selectedOrganization.websiteUrl ||
              selectedOrganization.socialUrl) && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-nebula-mint">
                  Links
                </h4>
                <div className="flex flex-wrap gap-3">
                  {selectedOrganization.websiteUrl && (
                    <a
                      href={selectedOrganization.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-stellar-blue hover:text-nebula-mint transition-colors"
                    >
                      <img
                        src={externalLinkIcon}
                        alt="External Link"
                        className="w-5 h-5 object-contain logo-nebula-mint"
                      />
                      <span>Website</span>
                    </a>
                  )}
                  {selectedOrganization.socialUrl && (
                    <a
                      href={selectedOrganization.socialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-stellar-blue hover:text-nebula-mint transition-colors"
                    >
                      <img
                        src={socialMediaIcon}
                        alt="Social Media"
                        className="w-5 h-5 object-contain logo-nebula-mint"
                      />
                      <span>Social Media</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </PopupModal>
    </>
  );
};

export default OrganizationsSection;
