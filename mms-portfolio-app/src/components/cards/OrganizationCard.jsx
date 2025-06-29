import { useState } from "react";
import organizationLogo from "../../assets/info/organization.png";
import externalLinkIcon from "../../assets/info/external-link.png";
import socialMediaLogo from "../../assets/info/social-media.png";

const OrganizationCard = ({ organization, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className="card hover:bg-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              {organization.image ? (
                <img
                  src={organization.image}
                  alt={organization.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-stellar-blue/20 flex items-center justify-center group-hover:bg-stellar-blue/30 transition-all duration-300"
                style={{ display: organization.image ? "none" : "flex" }}
              >
                <img
                  src={organizationLogo}
                  alt="Organization"
                  className="h-6 w-6 object-contain logo-nebula-mint"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-nebula-mint group-hover:text-stellar-blue transition-colors duration-300">
                {organization.name}
              </h3>
              <p className="text-stellar-blue text-lg font-semibold">
                {organization.role}
              </p>
              {organization.location && (
                <p className="text-nebula-mint/60 text-sm">
                  {organization.location}
                </p>
              )}
            </div>

            <p className="text-nebula-mint/80 leading-relaxed line-clamp-3">
              {organization.description}
            </p>

            {/* Display URL links if available */}
            {(organization.websiteUrl || organization.socialUrl) && (
              <div className="flex gap-2">
                {organization.websiteUrl && (
                  <a
                    href={organization.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stellar-blue hover:text-nebula-mint text-sm flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={externalLinkIcon}
                      alt="Website"
                      className="h-4 w-4 object-contain logo-nebula-mint"
                    />
                    Website
                  </a>
                )}
                {organization.socialUrl && (
                  <a
                    href={organization.socialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stellar-blue hover:text-nebula-mint text-sm flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={socialMediaLogo}
                      alt="Social Media"
                      className="h-4 w-4 object-contain logo-nebula-mint"
                    />
                    Social Media
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

export default OrganizationCard;
