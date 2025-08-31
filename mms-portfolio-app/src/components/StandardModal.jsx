import { useEffect } from "react";
import { loadImage, handleImageError } from "../services/imageService";
import LabelCard from "./cards/LabelCard";

// Import all the logos we might need
import githubIcon from "../assets/info/github.png";
import liveIcon from "../assets/info/pulse.png";
import externalLinkIcon from "../assets/info/external-link.png";
import twitterIcon from "../assets/info/twitter.png";
import instagramIcon from "../assets/info/instagram.png";
import youtubeIcon from "../assets/info/youtube.png";
import teamIcon from "../assets/info/team.png";
import personIcon from "../assets/info/person.png";
import locationIcon from "../assets/info/location-pin.png";
import calendarIcon from "../assets/info/schedule.png";
import certificateIcon from "../assets/info/certificate.png";
import briefcaseIcon from "../assets/info/briefcase.png";
import verifyIcon from "../assets/info/verify.png";
import departmentIcon from "../assets/info/department.png";

const StandardModal = ({
  isOpen,
  onClose,
  item,
  sectionType,
  className = "",
  imageSize = "w-20 h-20",
  showImage = true,
  header,
  subheader,
  metadata = [],
  description,
  tags = [],
  links = [],
  additionalSections = [],
  content,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Get fallback image for the section
  const getFallbackImage = () => {
    switch (sectionType) {
      case "project":
        return "/src/assets/info/code.png";
      case "education":
        return "/src/assets/info/education.png";
      case "organization":
        return "/src/assets/info/organization.png";
      case "experience":
        return "/src/assets/info/briefcase.png";
      case "certificate":
        return "/src/assets/info/certificate.png";
      default:
        return "/src/assets/info/information.png";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-deep-space/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-deep-space border border-cosmic-purple/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-nebula-mint">{header}</h2>

          <button
            onClick={onClose}
            className="text-nebula-mint/60 hover:text-nebula-mint transition-colors duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Header Information */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              {showImage && item?.image && (
                <img
                  src={item.image}
                  alt={header}
                  className={`${imageSize} object-cover rounded-lg border border-cosmic-purple/30 flex-shrink-0`}
                />
              )}
              <div className="flex-1">
                {subheader && (
                  <h3 className="text-stellar-blue text-xl font-semibold">
                    {subheader}
                  </h3>
                )}

                {/* Metadata */}
                {metadata.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {metadata.map((meta, index) => (
                      <p
                        key={index}
                        className="text-nebula-mint/60 text-sm flex items-center gap-1"
                      >
                        {meta.icon && (
                          <img
                            src={meta.icon}
                            alt={meta.label || "Info"}
                            className="h-3 w-3 object-contain logo-nebula-mint"
                          />
                        )}
                        {meta.label && <span>{meta.label}: </span>}
                        {meta.value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-nebula-mint">
                Description
              </h4>
              <pre className="text-nebula-mint/80 leading-relaxed text-lg whitespace-pre-wrap font-sans">
                {description}
              </pre>
            </div>
          )}

          {/* Custom Content (e.g., Preferred Subjects) */}
          {content}

          {/* Tags */}
          {tags && tags.items && tags.items.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-nebula-mint">
                {tags.label || "Tags"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.items.map((tag, index) => (
                  <LabelCard key={index} label={tag} onClick={() => {}} />
                ))}
              </div>
            </div>
          )}

          {/* Additional Sections */}
          {additionalSections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-lg font-semibold text-nebula-mint">
                {section.title}
              </h4>
              {section.content}
            </div>
          ))}

          {/* Links */}
          {links.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-nebula-mint">Links</h4>
              <div className="flex flex-wrap gap-3">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-stellar-blue hover:text-nebula-mint transition-colors"
                  >
                    <img
                      src={link.icon}
                      alt={link.alt}
                      className="w-5 h-5 object-contain logo-nebula-mint"
                    />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandardModal;
