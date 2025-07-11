import { useState } from "react";
import { useData } from "../contexts/DataContext";
import experienceLogo from "../assets/info/briefcase.png";
import externalLinkIcon from "../assets/info/external-link.png";
import calendarIcon from "../assets/info/schedule.png";
import locationIcon from "../assets/info/location-pin.png";
import SectionWrapper from "./SectionWrapper";
import StandardCard from "./cards/StandardCard";
import PopupModal from "./PopupModal";
import LabelCard from "./cards/LabelCard";

const ExperienceSection = () => {
  const { data } = useData();
  const { experience } = data;
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const icon = (
    <img
      src={experienceLogo}
      alt="Experience"
      className="h-8 w-8 object-contain"
    />
  );

  const handleCardClick = (exp) => {
    setSelectedExperience(exp);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExperience(null);
  };

  return (
    <>
      <SectionWrapper
        id="experience"
        title="Experience"
        icon={icon}
        description="My professional journey and work experience, highlighting my growth and contributions in various roles."
        nextSectionId="organizations"
        prevSectionId="personal"
        showArrow={false}
      >
        <div className="space-y-6">
          {experience.map((exp) => {
            // Prepare content for the card
            const formatDateRange = (startDate, endDate, isPresent) => {
              const formatDate = (dateString) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                });
              };

              const start = formatDate(startDate);
              const end = endDate ? formatDate(endDate) : "Present";
              return `${start} - ${end}`;
            };

            const content = (
              <div className="space-y-2">
                <p className="text-nebula-mint/60 text-sm flex items-center gap-1">
                  <img
                    src={calendarIcon}
                    alt="Period"
                    className="h-3 w-3 object-contain logo-nebula-mint"
                  />
                  {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}
                </p>
                {exp.location && (
                  <p className="text-nebula-mint/60 text-sm flex items-center gap-1">
                    <img
                      src={locationIcon}
                      alt="Location"
                      className="h-3 w-3 object-contain logo-nebula-mint"
                    />
                    {exp.location}
                  </p>
                )}
              </div>
            );

            // Prepare links for the card
            const links = [];
            if (exp.websiteUrl) {
              links.push({
                url: exp.websiteUrl,
                label: "Company Website",
                icon: externalLinkIcon,
                alt: "Company Website",
              });
            }

            return (
              <StandardCard
                key={exp.id}
                item={exp}
                sectionType="experience"
                onClick={() => handleCardClick(exp)}
                imageSize="w-16 h-16"
                header={exp.title}
                subheader={exp.company}
                shortDescription={exp.shortDescription}
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
        title={selectedExperience?.title}
      >
        {selectedExperience && (
          <div className="space-y-6">
            {/* Header Information */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                {selectedExperience.image && (
                  <img
                    src={selectedExperience.image}
                    alt={selectedExperience.company}
                    className="w-20 h-20 object-cover rounded-lg border border-cosmic-purple/30 flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-stellar-blue text-xl font-semibold">
                    {selectedExperience.company}
                  </h3>
                  <p className="text-nebula-mint/80 text-lg">
                    {selectedExperience.title}
                  </p>
                  {selectedExperience.period && (
                    <p className="text-nebula-mint/60 text-sm">
                      📅 {selectedExperience.period}
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
                {selectedExperience.longDescription ||
                  selectedExperience.shortDescription}
              </p>
            </div>

            {/* Technologies */}
            {(selectedExperience.technologies || []).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-nebula-mint">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedExperience.technologies.map((tech, index) => (
                    <LabelCard key={index} label={tech} onClick={() => {}} />
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {selectedExperience.companyUrl && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-nebula-mint">
                  Links
                </h4>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={selectedExperience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-stellar-blue hover:text-nebula-mint transition-colors"
                  >
                    <img
                      src={externalLinkIcon}
                      alt="External Link"
                      className="w-5 h-5"
                    />
                    <span>Company Website</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </PopupModal>
    </>
  );
};

export default ExperienceSection;
