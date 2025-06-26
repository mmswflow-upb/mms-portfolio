import { useState } from "react";
import { useData } from "../contexts/DataContext";
import briefcaseLogo from "../assets/info/briefcase.png";
import SectionWrapper from "./SectionWrapper";
import ExperienceCard from "./cards/ExperienceCard";
import PopupModal from "./PopupModal";
import LabelCard from "./cards/LabelCard";

const ExperienceSection = () => {
  const { data } = useData();
  const { experience } = data;
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const icon = (
    <img
      src={briefcaseLogo}
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
        description="My professional journey in the tech industry, showcasing the roles and responsibilities that have shaped my expertise."
        nextSectionId="organizations"
        prevSectionId="personal"
        showArrow={false}
      >
        <div className="space-y-6">
          {experience && experience.length > 0 ? (
            experience.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                onClick={() => handleCardClick(exp)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-nebula-mint/60">
                No experience entries found.
              </p>
            </div>
          )}
        </div>
      </SectionWrapper>

      <PopupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedExperience?.title}
      >
        {selectedExperience && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-stellar-blue text-xl font-semibold">
                  {selectedExperience.company}
                </p>
                <p className="text-nebula-mint/60">
                  {selectedExperience.period}
                </p>
              </div>

              <p className="text-nebula-mint/80 leading-relaxed text-lg">
                {selectedExperience.description}
              </p>
            </div>

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
          </div>
        )}
      </PopupModal>
    </>
  );
};

export default ExperienceSection;
