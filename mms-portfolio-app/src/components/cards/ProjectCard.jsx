import { useState } from "react";
import codeLogo from "../../assets/info/code.png";
import githubLogo from "../../assets/info/github.png";
import liveLogo from "../../assets/info/pulse.png";
import teamIcon from "../../assets/info/team.png";
import personIcon from "../../assets/info/person.png";

const ProjectCard = ({ project, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className="card hover:bg-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-lg overflow-hidden">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-stellar-blue/20 flex items-center justify-center group-hover:bg-stellar-blue/30 transition-all duration-300"
                style={{ display: project.image ? "none" : "flex" }}
              >
                <img
                  src={codeLogo}
                  alt="Project"
                  className="h-6 w-6 object-contain logo-nebula-mint"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-nebula-mint group-hover:text-stellar-blue transition-colors duration-300">
                {project.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                {project.role && (
                  <p className="text-stellar-blue text-sm font-medium">
                    {project.role}
                  </p>
                )}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    project.teamType === "team"
                      ? "bg-stellar-blue/20 border border-stellar-blue/30 text-stellar-blue"
                      : "bg-stellar-blue/20 border border-stellar-blue/30 text-stellar-blue"
                  }`}
                >
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
              </div>
            </div>

            <p className="text-nebula-mint/80 leading-relaxed line-clamp-3">
              {project.description}
            </p>

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

            {/* Display URL links if available */}
            {(project.githubUrl || project.liveUrl) && (
              <div className="flex gap-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stellar-blue hover:text-nebula-mint text-sm flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={githubLogo}
                      alt="GitHub"
                      className="h-4 w-4 object-contain logo-nebula-mint"
                    />
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stellar-blue hover:text-nebula-mint text-sm flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={liveLogo}
                      alt="Live Demo"
                      className="h-4 w-4 object-contain logo-nebula-mint"
                    />
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
