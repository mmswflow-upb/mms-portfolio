import { useState } from "react";
import { useData } from "../contexts/DataContext";
import codeLogo from "../assets/info/code.png";
import SectionWrapper from "./SectionWrapper";
import ProjectCard from "./cards/ProjectCard";
import PopupModal from "./PopupModal";
import LabelCard from "./cards/LabelCard";

const ProjectsSection = () => {
  const { data } = useData();
  const { projects } = data;
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const icon = (
    <img src={codeLogo} alt="Projects" className="h-8 w-8 object-contain" />
  );

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <SectionWrapper
        id="projects"
        title="Projects"
        icon={icon}
        description="A showcase of my recent projects, demonstrating my skills and passion for creating innovative solutions."
        nextSectionId="certificates"
        prevSectionId="education"
        showArrow={false}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleCardClick(project)}
            />
          ))}
        </div>
      </SectionWrapper>

      <PopupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProject?.title}
      >
        {selectedProject && (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-nebula-mint/80 leading-relaxed text-lg">
                {selectedProject.description}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-nebula-mint">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech, index) => (
                  <LabelCard key={index} label={tech} onClick={() => {}} />
                ))}
              </div>
            </div>
          </div>
        )}
      </PopupModal>
    </>
  );
};

export default ProjectsSection;
