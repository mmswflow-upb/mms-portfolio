import { useState } from "react";
import { useData } from "../contexts/DataContext";
import codeLogo from "../assets/info/coding.png";
import teamIcon from "../assets/info/team.png";
import personIcon from "../assets/info/person.png";
import webIcon from "../assets/info/web-dev.png";
import embeddedIcon from "../assets/info/embedded.png";
import gameIcon from "../assets/info/game.png";
import appIcon from "../assets/info/dashboard.png";
import algorithmIcon from "../assets/info/algorithm.png";
import projectIcon from "../assets/info/project.png";
import twitterIcon from "../assets/info/twitter.png";
import instagramIcon from "../assets/info/instagram.png";
import youtubeIcon from "../assets/info/youtube.png";
import githubIcon from "../assets/info/github.png";
import liveIcon from "../assets/info/pulse.png";
import SectionWrapper from "./SectionWrapper";
import StandardCard from "./cards/StandardCard";
import PopupModal from "./PopupModal";
import LabelCard from "./cards/LabelCard";

const ProjectsSection = () => {
  const { data } = useData();
  const { projects } = data;
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const icon = (
    <img src={projectIcon} alt="Projects" className="h-8 w-8 object-contain" />
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
      case "All":
        return codeLogo;
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
            filteredProjects.map((project) => {
              // Prepare content for the card
              const content = (
                <div className="space-y-3">
                  {(project.technologies || []).length > 0 && (
                    <div>
                      <span className="text-nebula-mint/60 text-sm font-semibold mr-2">
                        Tech Stack:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {project.technologies.slice(0, 4).map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-stellar-blue/20 border border-stellar-blue/30 rounded-full text-stellar-blue text-sm group-hover:bg-stellar-blue/30 group-hover:border-stellar-blue/50 transition-all duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-full text-nebula-mint/60 text-sm">
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );

              // Prepare subheader extra (team/individual label)
              const subheaderExtra = project.teamType ? (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-stellar-blue/20 border border-stellar-blue/30 text-stellar-blue">
                  {project.teamType === "team" ? (
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
                  {project.teamType === "team" ? "Team Project" : "Individual"}
                </span>
              ) : null;

              // Prepare links for the card
              const links = [];
              if (project.githubUrl) {
                links.push({
                  url: project.githubUrl,
                  label: "GitHub",
                  icon: githubIcon,
                  alt: "GitHub",
                });
              }
              if (project.liveUrl) {
                links.push({
                  url: project.liveUrl,
                  label: "Live Demo",
                  icon: liveIcon,
                  alt: "Live Demo",
                });
              }

              // Add social media links
              if (project.socialMedia && project.socialMedia.length > 0) {
                project.socialMedia.forEach((social) => {
                  const getSocialIcon = (platform) => {
                    switch (platform) {
                      case "twitter":
                        return twitterIcon;
                      case "instagram":
                        return instagramIcon;
                      case "youtube":
                        return youtubeIcon;
                      default:
                        return liveIcon;
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
                  key={project.id}
                  item={project}
                  sectionType="project"
                  onClick={() => handleCardClick(project)}
                  imageSize="w-20 h-20"
                  header={project.title}
                  subheader={project.role}
                  subheaderExtra={subheaderExtra}
                  shortDescription={project.shortDescription}
                  content={content}
                  links={links}
                />
              );
            })
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
                {selectedProject.longDescription ||
                  selectedProject.shortDescription}
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
            {(selectedProject.githubUrl ||
              selectedProject.liveUrl ||
              (selectedProject.socialMedia &&
                selectedProject.socialMedia.length > 0)) && (
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
                      <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
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
                      <img src={liveIcon} alt="Live Demo" className="w-5 h-5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {selectedProject.socialMedia &&
                    selectedProject.socialMedia.map((social, index) => {
                      const getSocialIcon = (platform) => {
                        switch (platform) {
                          case "twitter":
                            return twitterIcon;
                          case "instagram":
                            return instagramIcon;
                          case "youtube":
                            return youtubeIcon;
                          default:
                            return liveIcon;
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

export default ProjectsSection;
