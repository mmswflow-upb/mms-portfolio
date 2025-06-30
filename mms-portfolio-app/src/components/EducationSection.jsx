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
import SectionWrapper from "./SectionWrapper";
import StandardCard from "./cards/StandardCard";
import PopupModal from "./PopupModal";
import LabelCard from "./cards/LabelCard";

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
                    {edu.period}
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

      <PopupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedEducation?.degree}
      >
        {selectedEducation && (
          <div className="space-y-6">
            {/* Header Information */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                {selectedEducation.image && (
                  <img
                    src={selectedEducation.image}
                    alt={selectedEducation.institution}
                    className="w-20 h-20 object-cover rounded-lg border border-cosmic-purple/30 flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-stellar-blue text-xl font-semibold">
                    {selectedEducation.institution}
                  </h3>
                  <p className="text-nebula-mint/60 text-sm">
                    {selectedEducation.period}
                  </p>
                  {selectedEducation.location && (
                    <p className="text-nebula-mint/60 text-sm">
                      📍 {selectedEducation.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Degree Details */}
              <div className="space-y-2">
                <div>
                  <span className="text-nebula-mint/80 font-medium">
                    Degree:{" "}
                  </span>
                  <span className="text-nebula-mint">
                    {selectedEducation.degree}
                  </span>
                </div>
                {selectedEducation.gpa && (
                  <div>
                    <span className="text-nebula-mint/80 font-medium">
                      GPA:{" "}
                    </span>
                    <span className="text-nebula-mint">
                      {selectedEducation.gpa}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-nebula-mint">
                Description
              </h4>
              <p className="text-nebula-mint/80 leading-relaxed text-lg">
                {selectedEducation.longDescription ||
                  selectedEducation.shortDescription}
              </p>
            </div>

            {/* Relevant Subjects */}
            {(selectedEducation.subjects || []).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-nebula-mint">
                  Preferred Subjects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEducation.subjects.map((subject, index) => (
                    <LabelCard key={index} label={subject} onClick={() => {}} />
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(selectedEducation.websiteUrl ||
              selectedEducation.certificateUrl ||
              (selectedEducation.socialMedia &&
                selectedEducation.socialMedia.length > 0)) && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-nebula-mint">
                  Links
                </h4>
                <div className="flex flex-wrap gap-3">
                  {selectedEducation.websiteUrl && (
                    <a
                      href={selectedEducation.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-stellar-blue hover:text-nebula-mint transition-colors"
                    >
                      <img
                        src={externalLinkIcon}
                        alt="External Link"
                        className="w-5 h-5"
                      />
                      <span>Institution Website</span>
                    </a>
                  )}
                  {selectedEducation.certificateUrl && (
                    <a
                      href={selectedEducation.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-stellar-blue hover:text-nebula-mint transition-colors"
                    >
                      <img
                        src={externalLinkIcon}
                        alt="External Link"
                        className="w-5 h-5"
                      />
                      <span>View Certificate</span>
                    </a>
                  )}
                  {selectedEducation.socialMedia &&
                    selectedEducation.socialMedia.map((social, index) => {
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

export default EducationSection;
