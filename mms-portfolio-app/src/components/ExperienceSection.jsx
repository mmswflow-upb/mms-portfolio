import { useState } from "react";
import { useData } from "../contexts/DataContext";
import briefcaseLogo from "../assets/info/briefcase.png";
import teamIcon from "../assets/info/team.png";
import personIcon from "../assets/info/person.png";
import websiteIcon from "../assets/info/browser.png";
import externalLinkIcon from "../assets/info/external-link.png";
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
                  <p className="text-nebula-mint/60 text-sm">
                    {selectedExperience.period}
                  </p>
                  {(selectedExperience.role || selectedExperience.teamType) && (
                    <div className="flex items-center gap-3 mt-2">
                      {selectedExperience.role && (
                        <p className="text-nebula-mint/80 text-sm">
                          {selectedExperience.role}
                        </p>
                      )}
                      {selectedExperience.teamType && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-stellar-blue/20 border border-stellar-blue/30 text-stellar-blue">
                          {selectedExperience.teamType === "team" ? (
                            <img
                              src={teamIcon}
                              alt="Team"
                              className="h-3 w-3 object-contain logo-nebula-mint"
                            />
                          ) : (
                            <img
                              src={personIcon}
                              alt="Individual"
                              className="h-3 w-3 object-contain logo-nebula-mint"
                            />
                          )}
                          {selectedExperience.teamType === "team"
                            ? "Team"
                            : "Individual"}
                        </span>
                      )}
                    </div>
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
                {selectedExperience.description}
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

            {/* Additional Links */}
            {(selectedExperience.githubUrl ||
              selectedExperience.liveUrl ||
              selectedExperience.websiteUrl) && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-nebula-mint">
                  Links
                </h4>
                <div className="flex flex-wrap gap-3">
                  {selectedExperience.githubUrl && (
                    <a
                      href={selectedExperience.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-stellar-blue hover:text-nebula-mint transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                  )}
                  {selectedExperience.liveUrl && (
                    <a
                      href={selectedExperience.liveUrl}
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      <span>Live Demo</span>
                    </a>
                  )}
                  {selectedExperience.websiteUrl && (
                    <a
                      href={selectedExperience.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-stellar-blue hover:text-nebula-mint transition-colors"
                    >
                      <img
                        src={externalLinkIcon}
                        alt="External Link"
                        className="w-5 h-5 object-contain logo-nebula-mint"
                      />
                      <span>Company Website</span>
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

export default ExperienceSection;
