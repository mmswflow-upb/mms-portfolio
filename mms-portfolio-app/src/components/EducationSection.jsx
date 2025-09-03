import { useState } from "react";
import { useData } from "../contexts/DataContext";
import educationLogo from "../assets/info/education.png";
import externalLinkIcon from "../assets/info/external-link.png";
import twitterIcon from "../assets/info/twitter.png";
import instagramIcon from "../assets/info/instagram.png";
import youtubeIcon from "../assets/info/youtube.png";
import locationIcon from "../assets/info/location-pin.png";
import calendarIcon from "../assets/info/schedule.png";
import departmentIcon from "../assets/info/department.png";
import averageIcon from "../assets/info/average.png";
import SectionWrapper from "./SectionWrapper";
import StandardCard from "./cards/StandardCard";
import StandardModal from "./StandardModal";
import LabelCard from "./cards/LabelCard";
import { parseEscapedCommaList } from "../utils/stringUtils";
import { calculateShortPeriod } from "../utils/periodUtils";

const EducationSection = () => {
  const { data } = useData();
  const { education } = data;
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const icon = (
    <img
      src={educationLogo}
      alt="Education"
      className="h-8 w-8 object-contain"
    />
  );

  const handleCardClick = (edu) => {
    setSelectedEducation(edu);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEducation(null);
  };

  // Helper function to calculate period
  const getPeriod = (startDate, endDate) => {
    return calculateShortPeriod(startDate, endDate);
  };

  return (
    <>
      <SectionWrapper
        id="education"
        title="Education"
        icon={icon}
        description="My academic journey and educational achievements that have laid the foundation for my career."
        nextSectionId="projects"
        prevSectionId="organizations"
        showArrow={false}
      >
        <div className="space-y-6">
          {education.map((edu) => {
            // Prepare content for the card
            const content = (
              <div className="space-y-2">
                {edu.period && (
                  <p className="text-nebula-mint/60 text-sm flex items-center gap-1">
                    <img
                      src={calendarIcon}
                      alt="Period"
                      className="h-3 w-3 object-contain logo-nebula-mint"
                    />
                    {edu.period} •{" "}
                    {getPeriod(
                      edu.period.split(" - ")[0],
                      edu.period.split(" - ")[1]
                    )}
                  </p>
                )}
                {edu.department && (
                  <p className="text-nebula-mint/60 text-sm flex items-center gap-1">
                    <img
                      src={departmentIcon}
                      alt="Department"
                      className="h-3 w-3 object-contain logo-nebula-mint"
                    />
                    {edu.department}
                  </p>
                )}
                {edu.gpa && (
                  <p className="text-nebula-mint/60 text-sm flex items-center gap-1">
                    <img
                      src={averageIcon}
                      alt="Average Grade"
                      className="h-3 w-3 object-contain logo-nebula-mint"
                    />
                    Avg. Grade: {edu.gpa}
                  </p>
                )}
                {edu.location && (
                  <p className="text-nebula-mint/60 text-sm flex items-center gap-1">
                    <img
                      src={locationIcon}
                      alt="Location"
                      className="h-3 w-3 object-contain logo-nebula-mint"
                    />
                    {edu.location}
                  </p>
                )}
              </div>
            );

            // Prepare links for the card
            const links = [];
            if (edu.websiteUrl) {
              links.push({
                url: edu.websiteUrl,
                label: "Institution Website",
                icon: externalLinkIcon,
                alt: "Institution Website",
              });
            }

            // Add social media links
            if (edu.socialMedia && edu.socialMedia.length > 0) {
              edu.socialMedia.forEach((social) => {
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
                key={edu.id}
                item={edu}
                sectionType="education"
                onClick={() => handleCardClick(edu)}
                imageSize="w-16 h-16"
                header={edu.degree}
                subheader={edu.institution}
                shortDescription={edu.shortDescription}
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
        item={selectedEducation}
        sectionType="education"
        header={selectedEducation?.degree}
        subheader={selectedEducation?.institution}
        metadata={[
          ...(selectedEducation?.period
            ? [
                {
                  icon: calendarIcon,
                  value: `${selectedEducation.period} • ${getPeriod(
                    selectedEducation.period.split(" - ")[0],
                    selectedEducation.period.split(" - ")[1]
                  )}`,
                },
              ]
            : []),
          ...(selectedEducation?.department
            ? [
                {
                  icon: departmentIcon,
                  value: selectedEducation.department,
                },
              ]
            : []),
          ...(selectedEducation?.location
            ? [
                {
                  icon: locationIcon,
                  value: selectedEducation.location,
                },
              ]
            : []),
          ...(selectedEducation?.gpa
            ? [
                {
                  icon: averageIcon,
                  label: "Avg. Grade",
                  value: selectedEducation.gpa,
                },
              ]
            : []),
        ]}
        description={
          selectedEducation?.longDescription ||
          selectedEducation?.shortDescription
        }
        content={
          (selectedEducation?.relevantSubjects ||
            selectedEducation?.subjects) && (
            <div className="space-y-2 mt-2">
              <h4 className="text-lg font-semibold text-nebula-mint">
                Preferred Subjects
              </h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(selectedEducation?.relevantSubjects)
                  ? selectedEducation.relevantSubjects
                  : selectedEducation?.relevantSubjects
                  ? parseEscapedCommaList(selectedEducation.relevantSubjects)
                  : Array.isArray(selectedEducation?.subjects)
                  ? selectedEducation.subjects
                  : parseEscapedCommaList(selectedEducation?.subjects || "")
                ).map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )
        }
        links={[
          ...(selectedEducation?.websiteUrl
            ? [
                {
                  url: selectedEducation.websiteUrl,
                  label: "Institution Website",
                  icon: externalLinkIcon,
                  alt: "Institution Website",
                },
              ]
            : []),
          ...(selectedEducation?.certificateUrl
            ? [
                {
                  url: selectedEducation.certificateUrl,
                  label: "View Certificate",
                  icon: externalLinkIcon,
                  alt: "View Certificate",
                },
              ]
            : []),
          ...(selectedEducation?.socialMedia
            ? selectedEducation.socialMedia.map((social) => {
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

export default EducationSection;
