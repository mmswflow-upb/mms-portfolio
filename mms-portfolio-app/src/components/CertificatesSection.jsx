import { useState } from "react";
import { useData } from "../contexts/DataContext";
import certificateLogo from "../assets/info/certificate.png";
import externalLinkIcon from "../assets/info/external-link.png";
import verifyIcon from "../assets/info/verify.png";
import SectionWrapper from "./SectionWrapper";
import CertificateCard from "./cards/CertificateCard";
import PopupModal from "./PopupModal";
import LabelCard from "./cards/LabelCard";

const CertificatesSection = () => {
  const { data } = useData();
  const { certificates } = data;
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const icon = (
    <img
      src={certificateLogo}
      alt="Certificates"
      className="h-8 w-8 object-contain"
    />
  );

  const handleCardClick = (cert) => {
    setSelectedCertificate(cert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  return (
    <>
      <SectionWrapper
        id="certificates"
        title="Certificates"
        icon={icon}
        description="Professional certifications and achievements that validate my expertise and commitment to continuous learning."
        nextSectionId="contact"
        prevSectionId="projects"
        showArrow={false}
      >
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onClick={() => handleCardClick(cert)}
            />
          ))}
        </div>
      </SectionWrapper>

      <PopupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCertificate?.title}
      >
        {selectedCertificate && (
          <div className="space-y-6">
            {/* Header Information */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                {selectedCertificate.image && (
                  <img
                    src={selectedCertificate.image}
                    alt={selectedCertificate.title}
                    className="w-20 h-20 object-cover rounded-lg border border-cosmic-purple/30 flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-stellar-blue text-xl font-semibold">
                    {selectedCertificate.issuer}
                  </h3>
                  {(selectedCertificate.issueDate ||
                    selectedCertificate.expiryDate) && (
                    <div className="space-y-1 mt-2">
                      {selectedCertificate.issueDate && (
                        <p className="text-nebula-mint/80 text-sm">
                          Issued: {selectedCertificate.issueDate}
                        </p>
                      )}
                      {selectedCertificate.expiryDate && (
                        <p className="text-nebula-mint/80 text-sm">
                          Expires: {selectedCertificate.expiryDate}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Details */}
              <div className="space-y-2">
                {selectedCertificate.certificateId && (
                  <div>
                    <span className="text-nebula-mint/80 font-medium">
                      Certificate ID:{" "}
                    </span>
                    <span className="text-nebula-mint font-mono text-sm">
                      {selectedCertificate.certificateId}
                    </span>
                  </div>
                )}
                {selectedCertificate.level && (
                  <div>
                    <span className="text-nebula-mint/80 font-medium">
                      Level:{" "}
                    </span>
                    <span className="text-nebula-mint">
                      {selectedCertificate.level}
                    </span>
                  </div>
                )}
                {selectedCertificate.score && (
                  <div>
                    <span className="text-nebula-mint/80 font-medium">
                      Score:{" "}
                    </span>
                    <span className="text-nebula-mint">
                      {selectedCertificate.score}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-nebula-mint">
                Description
              </h4>
              <p className="text-nebula-mint/80 leading-relaxed text-lg">
                {selectedCertificate.description}
              </p>
            </div>

            {/* Skills/Coverage */}
            {(selectedCertificate.skills || []).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-nebula-mint">
                  Skills Covered
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCertificate.skills.map((skill, index) => (
                    <LabelCard key={index} label={skill} onClick={() => {}} />
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(selectedCertificate.verificationUrl ||
              selectedCertificate.certificateUrl) && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-nebula-mint">
                  Links
                </h4>
                <div className="flex flex-wrap gap-3">
                  {selectedCertificate.verificationUrl && (
                    <a
                      href={selectedCertificate.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-stellar-blue hover:text-nebula-mint transition-colors"
                    >
                      <img
                        src={verifyIcon}
                        alt="Verify Certificate"
                        className="w-5 h-5"
                      />
                      <span>Verify Certificate</span>
                    </a>
                  )}
                  {selectedCertificate.certificateUrl && (
                    <a
                      href={selectedCertificate.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-stellar-blue hover:text-nebula-mint transition-colors"
                    >
                      <img
                        src={externalLinkIcon}
                        alt="External Link"
                        className="w-5 h-5"
                      />
                      <span>View Certificate</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </PopupModal>
    </>
  );
};

export default CertificatesSection;
