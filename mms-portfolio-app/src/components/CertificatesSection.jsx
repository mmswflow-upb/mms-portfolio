import { useState } from "react";
import { useData } from "../contexts/DataContext";
import certificateLogo from "../assets/info/certificate.png";
import externalLinkIcon from "../assets/info/external-link.png";
import verifyIcon from "../assets/info/verify.png";
import calendarIcon from "../assets/info/schedule.png";
import SectionWrapper from "./SectionWrapper";
import StandardCard from "./cards/StandardCard";
import StandardModal from "./StandardModal";
import LabelCard from "./cards/LabelCard";
import { parseEscapedCommaList } from "../utils/stringUtils";

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
            // Parse skills (handle both arrays and escaped comma strings)
            const skills = Array.isArray(cert.skills)
              ? cert.skills
              : cert.skills
              ? parseEscapedCommaList(cert.skills)
              : [];

            // Prepare content for the card
            const content = (
              <div className="space-y-2">
                {skills.length > 0 && (
                  <div>
                    <span className="text-nebula-mint/60 text-sm font-semibold mr-2">
                      Skills:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-stellar-blue/20 border border-stellar-blue/30 rounded-full text-stellar-blue text-sm group-hover:bg-stellar-blue/30 group-hover:border-stellar-blue/50 transition-all duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 4 && (
                        <span className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-full text-nebula-mint/60 text-sm">
                          +{skills.length - 4} more
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

      <StandardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedCertificate}
        sectionType="certificate"
        header={selectedCertificate?.title}
        subheader={selectedCertificate?.issuer}
        metadata={[
          ...(selectedCertificate?.credentialId
            ? [
                {
                  label: "Credential ID",
                  value: selectedCertificate.credentialId,
                },
              ]
            : []),
        ]}
        description={
          selectedCertificate?.longDescription ||
          selectedCertificate?.shortDescription
        }
        content={
          selectedCertificate?.skills &&
          (Array.isArray(selectedCertificate.skills)
            ? selectedCertificate.skills.length > 0
            : selectedCertificate.skills) && (
            <div className="space-y-2 mt-2">
              <h4 className="text-lg font-semibold text-nebula-mint">
                Skills Covered
              </h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(selectedCertificate.skills)
                  ? selectedCertificate.skills
                  : parseEscapedCommaList(selectedCertificate.skills || "")
                ).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )
        }
        links={
          selectedCertificate?.credentialUrl
            ? [
                {
                  url: selectedCertificate.credentialUrl,
                  label: "Verify Certificate",
                  icon: verifyIcon,
                  alt: "Verify Certificate",
                },
              ]
            : []
        }
      />
    </>
  );
};

export default CertificatesSection;
