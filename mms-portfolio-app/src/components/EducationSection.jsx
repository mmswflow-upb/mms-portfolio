import { useState } from "react";
import { useData } from "../contexts/DataContext";
import educationLogo from "../assets/info/education.png";
import SectionWrapper from "./SectionWrapper";
import EducationCard from "./cards/EducationCard";
import PopupModal from "./PopupModal";

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
      >
        <div className="space-y-6">
          {education.map((edu) => (
            <EducationCard
              key={edu.id}
              education={edu}
              onClick={() => handleCardClick(edu)}
            />
          ))}
        </div>
      </SectionWrapper>

      <PopupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedEducation?.degree}
      >
        {selectedEducation && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-stellar-blue text-xl font-semibold">
                  {selectedEducation.institution}
                </p>
                <p className="text-nebula-mint/60">
                  {selectedEducation.period}
                </p>
              </div>

              <p className="text-nebula-mint/80 leading-relaxed text-lg">
                {selectedEducation.description}
              </p>
            </div>
          </div>
        )}
      </PopupModal>
    </>
  );
};

export default EducationSection;
