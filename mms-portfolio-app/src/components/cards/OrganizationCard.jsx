import { useState } from "react";
import organizationLogo from "../../assets/info/organization.png";

const OrganizationCard = ({ organization, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className="card hover:bg-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="p-3 bg-stellar-blue/20 rounded-lg group-hover:bg-stellar-blue/30 transition-all duration-300">
              <img
                src={organizationLogo}
                alt="Organization"
                className="h-6 w-6 object-contain logo-nebula-mint"
              />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-nebula-mint group-hover:text-stellar-blue transition-colors duration-300">
                {organization.title}
              </h3>
              <p className="text-stellar-blue text-lg font-semibold">
                {organization.organization}
              </p>
            </div>

            <p className="text-nebula-mint/80 leading-relaxed line-clamp-3">
              {organization.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;
