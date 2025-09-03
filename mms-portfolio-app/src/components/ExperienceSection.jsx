import { useState } from "react";
import { useData } from "../contexts/DataContext";
import experienceLogo from "../assets/info/briefcase.png";
import externalLinkIcon from "../assets/info/external-link.png";
import calendarIcon from "../assets/info/schedule.png";
import locationIcon from "../assets/info/location-pin.png";
import SectionWrapper from "./SectionWrapper";
import StandardCard from "./cards/StandardCard";
import StandardModal from "./StandardModal";
import LabelCard from "./cards/LabelCard";
import { parseEscapedCommaList } from "../utils/stringUtils";
import { calculateShortPeriod } from "../utils/periodUtils";

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

  // Helper function to format date range
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

  // Helper function to calculate period
  const getPeriod = (startDate, endDate) => {
    return calculateShortPeriod(startDate, endDate);
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
            const content = (
              <div className="space-y-2">
                <p className="text-nebula-mint/60 text-sm flex items-center gap-1">
                  <img
                    src={calendarIcon}
                    alt="Period"
                    className="h-3 w-3 object-contain logo-nebula-mint"
                  />
                  {formatDateRange(exp.startDate, exp.endDate, exp.isPresent)} •{" "}
                  {getPeriod(exp.startDate, exp.endDate)}
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

      <StandardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedExperience}
        sectionType="experience"
        header={selectedExperience?.title}
        subheader={selectedExperience?.company}
        metadata={[
          {
            icon: calendarIcon,
            value: selectedExperience
              ? `${formatDateRange(
                  selectedExperience.startDate,
                  selectedExperience.endDate,
                  selectedExperience.isPresent
                )} • ${getPeriod(
                  selectedExperience.startDate,
                  selectedExperience.endDate
                )}`
              : "",
          },
          ...(selectedExperience?.location
            ? [
                {
                  icon: locationIcon,
                  value: selectedExperience.location,
                },
              ]
            : []),
        ]}
        description={
          selectedExperience?.longDescription ||
          selectedExperience?.shortDescription
        }
        content={
          selectedExperience?.technologies &&
          (Array.isArray(selectedExperience.technologies)
            ? selectedExperience.technologies.length > 0
            : selectedExperience.technologies) && (
            <div className="space-y-2 mt-2">
              <h4 className="text-lg font-semibold text-nebula-mint">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(selectedExperience.technologies)
                  ? selectedExperience.technologies
                  : parseEscapedCommaList(selectedExperience.technologies || "")
                ).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )
        }
        links={
          selectedExperience?.websiteUrl
            ? [
                {
                  url: selectedExperience.websiteUrl,
                  label: "Company Website",
                  icon: externalLinkIcon,
                  alt: "Company Website",
                },
              ]
            : []
        }
      />
    </>
  );
};

export default ExperienceSection;
