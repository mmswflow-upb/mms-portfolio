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
import StandardModal from "./StandardModal";
import LabelCard from "./cards/LabelCard";
import { parseEscapedCommaList } from "../utils/stringUtils";

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
              // Parse technologies (handle both arrays and escaped comma strings)
              const technologies = Array.isArray(project.technologies)
                ? project.technologies
                : project.technologies
                ? parseEscapedCommaList(project.technologies)
                : [];

              // Prepare content for the card
              const content = (
                <div className="space-y-3">
                  {technologies.length > 0 && (
                    <div>
                      <span className="text-nebula-mint/60 text-sm font-semibold mr-2">
                        Tech Stack:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {technologies.slice(0, 4).map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-stellar-blue/20 border border-stellar-blue/30 rounded-full text-stellar-blue text-sm group-hover:bg-stellar-blue/30 group-hover:border-stellar-blue/50 transition-all duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {technologies.length > 4 && (
                          <span className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-full text-nebula-mint/60 text-sm">
                            +{technologies.length - 4} more
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

      <StandardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedProject}
        sectionType="project"
        header={selectedProject?.title}
        subheader={selectedProject?.role}
        metadata={[
          ...(selectedProject?.teamType
            ? [
                {
                  icon:
                    selectedProject.teamType === "team" ? teamIcon : personIcon,
                  value:
                    selectedProject.teamType === "team"
                      ? "Team Project"
                      : "Individual",
                },
              ]
            : []),
        ]}
        description={
          selectedProject?.longDescription || selectedProject?.shortDescription
        }
        content={
          selectedProject?.technologies &&
          (Array.isArray(selectedProject.technologies)
            ? selectedProject.technologies.length > 0
            : selectedProject.technologies) && (
            <div className="space-y-2 mt-2">
              <h4 className="text-lg font-semibold text-nebula-mint">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(selectedProject.technologies)
                  ? selectedProject.technologies
                  : parseEscapedCommaList(selectedProject.technologies || "")
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
        links={[
          ...(selectedProject?.githubUrl
            ? [
                {
                  url: selectedProject.githubUrl,
                  label: "GitHub Repository",
                  icon: githubIcon,
                  alt: "GitHub",
                },
              ]
            : []),
          ...(selectedProject?.liveUrl
            ? [
                {
                  url: selectedProject.liveUrl,
                  label: "Live Demo",
                  icon: liveIcon,
                  alt: "Live Demo",
                },
              ]
            : []),
          ...(selectedProject?.socialMedia
            ? selectedProject.socialMedia.map((social) => {
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

                return {
                  url: social.url,
                  label: getSocialLabel(social.platform),
                  icon: getSocialIcon(social.platform),
                  alt: getSocialLabel(social.platform),
                };
              })
            : []),
        ]}
      />
    </>
  );
};

export default ProjectsSection;
