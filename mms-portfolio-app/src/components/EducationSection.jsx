import { useState } from "react";
import { useData } from "../contexts/DataContext";
import educationLogo from "../assets/info/education.png";
import SectionWrapper from "./SectionWrapper";
import EducationCard from "./cards/EducationCard";
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
                {selectedEducation.description}
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
              selectedEducation.certificateUrl) && (
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>View Certificate</span>
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

export default EducationSection;
