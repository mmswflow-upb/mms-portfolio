import { useState } from "react";
import { useData } from "../contexts/DataContext";
import organizationLogo from "../assets/info/organization.png";
import externalLinkIcon from "../assets/info/external-link.png";
import twitterIcon from "../assets/info/twitter.png";
import instagramIcon from "../assets/info/instagram.png";
import youtubeIcon from "../assets/info/youtube.png";
import locationIcon from "../assets/info/location-pin.png";
import calendarIcon from "../assets/info/schedule.png";
import SectionWrapper from "./SectionWrapper";
import StandardCard from "./cards/StandardCard";
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
        description="My involvement in various organizations and communities, showcasing my commitment to collaboration and professional growth."
        nextSectionId="education"
        prevSectionId="experience"
        showArrow={false}
      >
        <div className="space-y-6">
          {organizations.map((org) => {
            // Prepare content for the card
            const content = (
              <div className="space-y-2">
                {org.location && (
                  <p className="text-nebula-mint/60 text-sm flex items-center gap-1">
                    <img
                      src={locationIcon}
                      alt="Location"
                      className="h-3 w-3 object-contain logo-nebula-mint"
                    />
                    {org.location}
                  </p>
                )}
                {(org.startDate || org.endDate) && (
                  <p className="text-nebula-mint/60 text-sm flex items-center gap-1">
                    <img
                      src={calendarIcon}
                      alt="Period"
                      className="h-3 w-3 object-contain logo-nebula-mint"
                    />
                    {org.startDate && org.endDate
                      ? `${org.startDate} - ${org.endDate}`
                      : org.startDate
                      ? `${org.startDate} - Present`
                      : org.endDate}
                  </p>
                )}
              </div>
            );

            // Prepare links for the card
            const links = [];
            if (org.websiteUrl) {
              links.push({
                url: org.websiteUrl,
                label: "Website",
                icon: externalLinkIcon,
                alt: "Website",
              });
            }

            // Add social media links
            if (org.socialMedia && org.socialMedia.length > 0) {
              org.socialMedia.forEach((social) => {
                const getSocialIcon = (platform) => {
                  switch (platform) {
                    case "twitter":
                      return twitterIcon;
                    case "instagram":
                      return instagramIcon;
                    case "youtube":
                      return youtubeIcon;
                    default:
                      return externalLinkIcon;
                  }
                };

                const getSocialLabel = (platform) => {
                  switch (platform) {
                    case "twitter":
                      return "Twitter";
                    case "instagram":
                      return "Instagram";
                    case "youtube":
                      return "YouTube";
                    default:
                      return (
                        platform.charAt(0).toUpperCase() + platform.slice(1)
                      );
                  }
                };

                links.push({
                  url: social.url,
                  label: getSocialLabel(social.platform),
                  icon: getSocialIcon(social.platform),
                  alt: getSocialLabel(social.platform),
                });
              });
            }

            return (
              <StandardCard
                key={org.id}
                item={org}
                sectionType="organization"
                onClick={() => handleCardClick(org)}
                imageSize="w-16 h-16"
                header={org.title || org.role}
                subheader={org.name || org.organization}
                shortDescription={org.shortDescription}
                content={content}
                links={links}
              />
            );
          })}
        </div>
      </SectionWrapper>

      <PopupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedOrganization?.name || selectedOrganization?.organization}
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
                      selectedOrganization.name ||
                      selectedOrganization.organization
                    }
                    className="w-20 h-20 object-cover rounded-lg border border-cosmic-purple/30 flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-stellar-blue text-xl font-semibold">
                    {selectedOrganization.name ||
                      selectedOrganization.organization}
                  </h3>
                  {selectedOrganization.role && (
                    <p className="text-nebula-mint/80 text-lg">
                      {selectedOrganization.role}
                    </p>
                  )}
                  {selectedOrganization.location && (
                    <p className="text-nebula-mint/60 text-sm">
                      📍 {selectedOrganization.location}
                    </p>
                  )}
                  {(selectedOrganization.startDate ||
                    selectedOrganization.endDate) && (
                    <p className="text-nebula-mint/60 text-sm">
                      📅{" "}
                      {selectedOrganization.startDate &&
                      selectedOrganization.endDate
                        ? `${selectedOrganization.startDate} - ${selectedOrganization.endDate}`
                        : selectedOrganization.startDate
                        ? `${selectedOrganization.startDate} - Present`
                        : selectedOrganization.endDate}
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
                {selectedOrganization.longDescription ||
                  selectedOrganization.shortDescription}
              </p>
            </div>

            {/* Links */}
            {(selectedOrganization.websiteUrl ||
              (selectedOrganization.socialMedia &&
                selectedOrganization.socialMedia.length > 0)) && (
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
                        className="w-5 h-5"
                      />
                      <span>Website</span>
                    </a>
                  )}
                  {selectedOrganization.socialMedia &&
                    selectedOrganization.socialMedia.map((social, index) => {
                      const getSocialIcon = (platform) => {
                        switch (platform) {
                          case "twitter":
                            return twitterIcon;
                          case "instagram":
                            return instagramIcon;
                          case "youtube":
                            return youtubeIcon;
                          default:
                            return externalLinkIcon;
                        }
                      };

                      const getSocialLabel = (platform) => {
                        switch (platform) {
                          case "twitter":
                            return "Twitter";
                          case "instagram":
                            return "Instagram";
                          case "youtube":
                            return "YouTube";
                          default:
                            return (
                              platform.charAt(0).toUpperCase() +
                              platform.slice(1)
                            );
                        }
                      };

                      return (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-stellar-blue hover:text-nebula-mint transition-colors"
                        >
                          <img
                            src={getSocialIcon(social.platform)}
                            alt={getSocialLabel(social.platform)}
                            className="w-5 h-5 object-contain logo-nebula-mint"
                          />
                          <span>{getSocialLabel(social.platform)}</span>
                        </a>
                      );
                    })}
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
