import { useState } from "react";
import certificateLogo from "../../assets/info/certificate.png";

const CertificateCard = ({ certificate, onClick, className = "" }) => {
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
                src={certificateLogo}
                alt="Certificate"
                className="h-6 w-6 object-contain logo-nebula-mint"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-nebula-mint group-hover:text-stellar-blue transition-colors duration-300">
                {certificate.title}
              </h3>
              <p className="text-stellar-blue font-medium">
                {certificate.issuer}
              </p>
            </div>
          </div>

          <p className="text-nebula-mint/80 leading-relaxed line-clamp-3">
            {certificate.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
