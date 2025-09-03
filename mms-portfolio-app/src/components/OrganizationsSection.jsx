import { useState } from "react";
import { useData } from "../contexts/DataContext";
import organizationLogo from "../assets/info/organization.png";
import externalLinkIcon from "../assets/info/external-link.png";
import twitterIcon from "../assets/info/twitter.png";
import instagramIcon from "../assets/info/instagram.png";
import youtubeIcon from "../assets/info/youtube.png";
import locationIcon from "../assets/info/location-pin.png";
import calendarIcon from "../assets/info/schedule.png";
import stackIcon from "../assets/info/stack.png";
import SectionWrapper from "./SectionWrapper";
import StandardCard from "./cards/StandardCard";
import StandardModal from "./StandardModal";
import { parseEscapedCommaList } from "../utils/stringUtils";
import { calculateShortPeriod } from "../utils/periodUtils";

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

  // Helper function to calculate period
  const getPeriod = (startDate, endDate) => {
    return calculateShortPeriod(startDate, endDate);
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
                      : org.endDate}{" "}
                    • {getPeriod(org.startDate, org.endDate)}
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

      <StandardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedOrganization}
        sectionType="organization"
        header={selectedOrganization?.title || selectedOrganization?.role}
        subheader={
          selectedOrganization?.name || selectedOrganization?.organization
        }
        metadata={[
          ...(selectedOrganization?.location
            ? [
                {
                  icon: locationIcon,
                  value: selectedOrganization.location,
                },
              ]
            : []),
          ...(selectedOrganization?.startDate || selectedOrganization?.endDate
            ? [
                {
                  icon: calendarIcon,
                  value: `${
                    selectedOrganization.startDate &&
                    selectedOrganization.endDate
                      ? `${selectedOrganization.startDate} - ${selectedOrganization.endDate}`
                      : selectedOrganization.startDate
                      ? `${selectedOrganization.startDate} - Present`
                      : selectedOrganization.endDate
                  } • ${getPeriod(
                    selectedOrganization.startDate,
                    selectedOrganization.endDate
                  )}`,
                },
              ]
            : []),
        ]}
        description={
          selectedOrganization?.longDescription ||
          selectedOrganization?.shortDescription
        }
        tags={
          selectedOrganization?.skills &&
          (Array.isArray(selectedOrganization.skills)
            ? selectedOrganization.skills.length > 0
            : selectedOrganization.skills)
            ? {
                label: "Skills",
                items: Array.isArray(selectedOrganization.skills)
                  ? selectedOrganization.skills
                  : parseEscapedCommaList(selectedOrganization.skills),
              }
            : null
        }
        links={[
          ...(selectedOrganization?.websiteUrl
            ? [
                {
                  url: selectedOrganization.websiteUrl,
                  label: "Website",
                  icon: externalLinkIcon,
                  alt: "Website",
                },
              ]
            : []),
          ...(selectedOrganization?.socialMedia
            ? selectedOrganization.socialMedia.map((social) => {
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

                return {
                  url: social.url,
                  label: getSocialLabel(social.platform),
                  icon: getSocialIcon(social.platform),
                  alt: getSocialLabel(social.platform),
                };
              })
            : []),
        ]}
      />
    </>
  );
};

export default OrganizationsSection;
