import { useState } from "react";
import briefcaseLogo from "../../assets/info/briefcase.png";

const ExperienceCard = ({ experience, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className="card hover:bg-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              {experience.image ? (
                <img
                  src={experience.image}
                  alt={experience.company}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-stellar-blue/20 flex items-center justify-center group-hover:bg-stellar-blue/30 transition-all duration-300"
                style={{ display: experience.image ? "none" : "flex" }}
              >
                <img
                  src={briefcaseLogo}
                  alt="Experience"
                  className="h-6 w-6 object-contain logo-nebula-mint"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-nebula-mint group-hover:text-stellar-blue transition-colors duration-300">
                {experience.title}
              </h3>
              <p className="text-stellar-blue text-lg font-semibold">
                {experience.company}
              </p>
              <p className="text-nebula-mint/60 text-sm">{experience.period}</p>
            </div>

            <p className="text-nebula-mint/80 leading-relaxed line-clamp-2">
              {experience.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {experience.technologies.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-stellar-blue/20 border border-stellar-blue/30 rounded-full text-stellar-blue text-sm group-hover:bg-stellar-blue/30 group-hover:border-stellar-blue/50 transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
              {experience.technologies.length > 3 && (
                <span className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-full text-nebula-mint/60 text-sm">
                  +{experience.technologies.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
