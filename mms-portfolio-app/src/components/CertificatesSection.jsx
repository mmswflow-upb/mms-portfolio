import { useState } from "react";
import { useData } from "../contexts/DataContext";
import certificateLogo from "../assets/info/certificate.png";
import SectionWrapper from "./SectionWrapper";
import CertificateCard from "./cards/CertificateCard";
import PopupModal from "./PopupModal";

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
            <div className="space-y-4">
              <div>
                <p className="text-stellar-blue text-xl font-semibold">
                  {selectedCertificate.issuer}
                </p>
              </div>

              <p className="text-nebula-mint/80 leading-relaxed text-lg">
                {selectedCertificate.description}
              </p>
            </div>
          </div>
        )}
      </PopupModal>
    </>
  );
};

export default CertificatesSection;
