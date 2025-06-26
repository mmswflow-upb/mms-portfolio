import { useState } from "react";
import educationLogo from "../../assets/info/education.png";

const EducationCard = ({ education, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className="card hover:bg-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              {education.image ? (
                <img
                  src={education.image}
                  alt={education.institution}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-stellar-blue/20 flex items-center justify-center group-hover:bg-stellar-blue/30 transition-all duration-300"
                style={{ display: education.image ? "none" : "flex" }}
              >
                <img
                  src={educationLogo}
                  alt="Education"
                  className="h-6 w-6 object-contain logo-nebula-mint"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-nebula-mint group-hover:text-stellar-blue transition-colors duration-300">
                {education.degree}
              </h3>
              <p className="text-stellar-blue text-lg font-semibold">
                {education.institution}
              </p>
              <p className="text-nebula-mint/60 text-sm">{education.period}</p>
            </div>

            <p className="text-nebula-mint/80 leading-relaxed line-clamp-3">
              {education.description}
            </p>

            {/* Display subjects if available */}
            {(education.subjects || []).length > 0 && (
              <div>
                <span className="text-nebula-mint/60 text-xs font-semibold mr-2">
                  Preferred Subjects:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {education.subjects.slice(0, 3).map((subject, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded text-nebula-mint text-xs"
                    >
                      {subject}
                    </span>
                  ))}
                  {education.subjects.length > 3 && (
                    <span className="px-2 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded text-nebula-mint text-xs">
                      +{education.subjects.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationCard;
