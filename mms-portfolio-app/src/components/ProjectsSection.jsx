import { useState } from "react";
import { useData } from "../contexts/DataContext";
import codeLogo from "../assets/info/code.png";
import teamIcon from "../assets/info/team.png";
import personIcon from "../assets/info/person.png";
import webIcon from "../assets/info/web-dev.png";
import embeddedIcon from "../assets/info/algorithm.png";
import gameIcon from "../assets/info/game.png";
import appIcon from "../assets/info/dashboard.png";
import algorithmIcon from "../assets/info/algorithm.png";
import SectionWrapper from "./SectionWrapper";
import ProjectCard from "./cards/ProjectCard";
import PopupModal from "./PopupModal";
import LabelCard from "./cards/LabelCard";

const ProjectsSection = () => {
  const { data } = useData();
  const { projects } = data;
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const icon = (
    <img src={codeLogo} alt="Projects" className="h-8 w-8 object-contain" />
  );

  // Get unique categories from projects
  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];

  // Filter projects based on selected category
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Web":
        return webIcon;
      case "Embedded":
        return embeddedIcon;
      case "Games":
        return gameIcon;
      case "App":
        return appIcon;
      case "Algorithms":
        return algorithmIcon;
      default:
        return codeLogo;
    }
  };

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
        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-stellar-blue/20 border-stellar-blue/50 text-stellar-blue"
                  : "bg-cosmic-purple/20 border-cosmic-purple/30 text-nebula-mint hover:bg-cosmic-purple/30 hover:border-cosmic-purple/50"
              }`}
            >
              <img
                src={getCategoryIcon(category)}
                alt={category}
                className="h-4 w-4 object-contain logo-nebula-mint"
              />
              <span className="font-medium">{category}</span>
              {selectedCategory === category && (
                <span className="text-xs bg-stellar-blue/30 px-2 py-1 rounded-full">
                  {filteredProjects.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleCardClick(project)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-nebula-mint/60 text-lg">
                No projects found in the "{selectedCategory}" category.
              </p>
              <p className="text-nebula-mint/40 text-sm mt-2">
                Try selecting a different category or check back later.
              </p>
            </div>
          )}
        </div>
      </SectionWrapper>

      <PopupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProject?.title}
      >
        {selectedProject && (
          <div className="space-y-6">
            {/* Header Information */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                {selectedProject.image && (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-20 h-20 object-cover rounded-lg border border-cosmic-purple/30 flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-stellar-blue text-xl font-semibold">
                    {selectedProject.title}
                  </h3>
                  {(selectedProject.role || selectedProject.teamType) && (
                    <div className="flex items-center gap-3 mt-2">
                      {selectedProject.role && (
                        <p className="text-nebula-mint/80 text-sm">
                          {selectedProject.role}
                        </p>
                      )}
                      {selectedProject.teamType && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-stellar-blue/20 border border-stellar-blue/30 text-stellar-blue">
                          {selectedProject.teamType === "team" ? (
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
                          {selectedProject.teamType === "team"
                            ? "Team Project"
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
                {selectedProject.description}
              </p>
            </div>

            {/* Technologies */}
            {(selectedProject.technologies || []).length > 0 && (
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
            )}

            {/* Links */}
            {(selectedProject.githubUrl || selectedProject.liveUrl) && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-nebula-mint">
                  Links
                </h4>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
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
                      <span>GitHub Repository</span>
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
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
                </div>
              </div>
            )}
          </div>
        )}
      </PopupModal>
    </>
  );
};

export default ProjectsSection;
