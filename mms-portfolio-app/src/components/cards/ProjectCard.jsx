import { useState } from "react";
import codeLogo from "../../assets/info/code.png";

const ProjectCard = ({ project, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className="card hover:bg-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-stellar-blue/20 rounded-lg group-hover:bg-stellar-blue/30 transition-all duration-300">
              <img
                src={codeLogo}
                alt="Project"
                className="h-6 w-6 object-contain logo-nebula-mint"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-nebula-mint group-hover:text-stellar-blue transition-colors duration-300">
                {project.title}
              </h3>
            </div>
          </div>

          <p className="text-nebula-mint/80 leading-relaxed line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
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
      </div>
    </div>
  );
};

export default ProjectCard;
