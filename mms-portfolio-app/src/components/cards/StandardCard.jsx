import { useState, useEffect } from "react";
import { loadImage, handleImageError } from "../../services/imageService";

// Import all the logos we might need
import githubIcon from "../../assets/info/github.png";
import liveIcon from "../../assets/info/pulse.png";
import externalLinkIcon from "../../assets/info/external-link.png";
import twitterIcon from "../../assets/info/twitter.png";
import instagramIcon from "../../assets/info/instagram.png";
import youtubeIcon from "../../assets/info/youtube.png";
import teamIcon from "../../assets/info/team.png";
import personIcon from "../../assets/info/person.png";
import locationIcon from "../../assets/info/location-pin.png";
import calendarIcon from "../../assets/info/schedule.png";
import certificateIcon from "../../assets/info/certificate.png";
import briefcaseIcon from "../../assets/info/briefcase.png";
import verifyIcon from "../../assets/info/verify.png";

const StandardCard = ({
  item,
  sectionType,
  onClick,
  className = "",
  imageSize = "w-16 h-16", // Default size, can be overridden
  showImage = true,
  header,
  subheader,
  subheaderExtra = null,
  shortDescription = null,
  content,
  links = [],
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  // Load image on component mount
  useEffect(() => {
    if (showImage && item.image) {
      loadImage(item.image, sectionType)
        .then((url) => {
          setImageUrl(url);
          setImageLoading(false);
        })
        .catch(() => {
          setImageUrl(null);
          setImageLoading(false);
        });
    } else {
      setImageLoading(false);
    }
  }, [item.image, sectionType, showImage]);

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

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className="card hover:bg-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300">
        <div className="flex items-start space-x-4">
          {/* Image Section */}
          {showImage && (
            <div className="flex-shrink-0">
              <div className={`${imageSize} rounded-lg overflow-hidden`}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={header}
                    className={`w-full h-full object-cover`}
                    onError={(e) => handleImageError(e, sectionType)}
                  />
                ) : (
                  <div className="w-full h-full bg-stellar-blue/20 flex items-center justify-center group-hover:bg-stellar-blue/30 transition-all duration-300">
                    <img
                      src={getFallbackImage()}
                      alt={header}
                      className={`h-6 w-6 object-contain logo-nebula-mint`}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 space-y-3">
            {/* Header Section */}
            <div>
              <h3 className="text-xl font-bold text-nebula-mint group-hover:text-stellar-blue transition-colors duration-300">
                {header}
              </h3>
              {(subheader || subheaderExtra) && (
                <div className="flex items-start gap-3 flex-wrap">
                  {subheader && (
                    <p className="text-stellar-blue text-lg font-semibold flex-1 min-w-0">
                      {subheader}
                    </p>
                  )}
                  {subheaderExtra && (
                    <div className="flex-shrink-0">{subheaderExtra}</div>
                  )}
                </div>
              )}
            </div>

            {/* Short Description */}
            {shortDescription && (
              <p className="text-stellar-blue text-sm font-semibold flex-1 min-w-0">
                {shortDescription}
              </p>
            )}

            {/* Content Section */}
            {content}

            {/* Links Section */}
            {links.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stellar-blue hover:text-nebula-mint text-sm flex items-center gap-1 transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={link.icon}
                      alt={link.alt}
                      className="h-4 w-4 object-contain logo-nebula-mint"
                    />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardCard;
