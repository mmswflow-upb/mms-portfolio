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
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                        />
                      </svg>
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
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
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
