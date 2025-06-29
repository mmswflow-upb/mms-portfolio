import { useState } from "react";
import certificateLogo from "../../assets/info/certificate.png";
import verifyIcon from "../../assets/info/verify.png";

const CertificateCard = ({ certificate, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className="card hover:bg-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden">
              {certificate.image ? (
                <img
                  src={certificate.image}
                  alt={certificate.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-full h-full bg-stellar-blue/20 flex items-center justify-center group-hover:bg-stellar-blue/30 transition-all duration-300"
                style={{ display: certificate.image ? "none" : "flex" }}
              >
                <img
                  src={certificateLogo}
                  alt="Certificate"
                  className="h-6 w-6 object-contain logo-nebula-mint"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-nebula-mint group-hover:text-stellar-blue transition-colors duration-300">
                {certificate.title}
              </h3>
              <p className="text-stellar-blue font-medium">
                {certificate.issuer}
              </p>
              {certificate.credentialId && (
                <p className="text-nebula-mint/60 text-sm">
                  ID: {certificate.credentialId}
                </p>
              )}
            </div>
          </div>

          {/* Display skills if available, otherwise show description */}
          {(certificate.skills || []).length > 0 ? (
            <div className="mt-3">
              <span className="text-nebula-mint/60 text-sm font-semibold mr-2">
                Skills:
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {certificate.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-stellar-blue/20 border border-stellar-blue/30 rounded-full text-stellar-blue text-sm"
                  >
                    {skill}
                  </span>
                ))}
                {certificate.skills.length > 4 && (
                  <span className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-full text-nebula-mint/80 text-sm">
                    +{certificate.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-nebula-mint/80 mt-3">
              {certificate.description}
            </p>
          )}

          {/* Display verification link if available */}
          {certificate.credentialUrl && (
            <div className="flex gap-2">
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stellar-blue hover:text-nebula-mint text-sm flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={verifyIcon}
                  alt="Verify Certificate"
                  className="h-4 w-4 object-contain logo-nebula-mint"
                />
                Verify Certificate
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
