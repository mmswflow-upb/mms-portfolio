import { useState } from "react";
import { useData } from "../contexts/DataContext";
import certificateLogo from "../assets/info/certificate.png";
import externalLinkIcon from "../assets/info/external-link.png";
import verifyIcon from "../assets/info/verify.png";
import SectionWrapper from "./SectionWrapper";
import StandardCard from "./cards/StandardCard";
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
        description="Professional certifications and achievements that validate my skills and expertise in various technologies and methodologies."
        nextSectionId="contact"
        prevSectionId="projects"
        showArrow={false}
      >
        <div className="space-y-6">
          {certificates.map((cert) => {
            // Prepare content for the card
            const content = (
              <div className="space-y-2">
                {(cert.skills || []).length > 0 && (
                  <div>
                    <span className="text-nebula-mint/60 text-sm font-semibold mr-2">
                      Skills:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {cert.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-stellar-blue/20 border border-stellar-blue/30 rounded-full text-stellar-blue text-sm group-hover:bg-stellar-blue/30 group-hover:border-stellar-blue/50 transition-all duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 4 && (
                        <span className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-full text-nebula-mint/60 text-sm">
                          +{cert.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );

            // Prepare links for the card
            const links = [];
            if (cert.credentialUrl) {
              links.push({
                url: cert.credentialUrl,
                label: "Verify Certificate",
                icon: verifyIcon,
                alt: "Verify Certificate",
              });
            }

            return (
              <StandardCard
                key={cert.id}
                item={cert}
                sectionType="certificate"
                onClick={() => handleCardClick(cert)}
                imageSize="w-16 h-16"
                header={cert.title}
                subheader={cert.issuer}
                shortDescription={cert.shortDescription}
                content={content}
                links={links}
              />
            );
          })}
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
                  <p className="text-nebula-mint/80 text-lg">
                    {selectedCertificate.title}
                  </p>
                  {selectedCertificate.issueDate && (
                    <p className="text-nebula-mint/60 text-sm">
                      📅 Issued: {selectedCertificate.issueDate}
                    </p>
                  )}
                  {selectedCertificate.expiryDate && (
                    <p className="text-nebula-mint/60 text-sm">
                      ⏰ Expires: {selectedCertificate.expiryDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {(selectedCertificate.longDescription ||
              selectedCertificate.shortDescription) && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-nebula-mint">
                  Description
                </h4>
                <p className="text-nebula-mint/80 leading-relaxed text-lg">
                  {selectedCertificate.longDescription ||
                    selectedCertificate.shortDescription}
                </p>
              </div>
            )}

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
            {selectedCertificate.credentialUrl && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-nebula-mint">
                  Links
                </h4>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={selectedCertificate.credentialUrl}
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
