import { useData } from "../contexts/DataContext";
import contactLogo from "../assets/info/contact.png";
import emailLogo from "../assets/info/email.png";
import phoneLogo from "../assets/info/phone.png";
import linkedinLogo from "../assets/info/linkedin.png";
import githubLogo from "../assets/info/github.png";
import SectionWrapper from "./SectionWrapper";

const ContactSection = () => {
  const { data } = useData();
  const { contact } = data;

  const icon = (
    <img src={contactLogo} alt="Contact" className="h-8 w-8 object-contain" />
  );

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case "email":
        return (
          <img
            src={emailLogo}
            alt="Email"
            className="h-6 w-6 object-contain logo-nebula-mint"
          />
        );
      case "phone":
        return (
          <img
            src={phoneLogo}
            alt="Phone"
            className="h-6 w-6 object-contain logo-nebula-mint"
          />
        );
      case "linkedin":
        return (
          <img
            src={linkedinLogo}
            alt="LinkedIn"
            className="h-6 w-6 object-contain logo-nebula-mint"
          />
        );
      case "github":
        return (
          <img
            src={githubLogo}
            alt="GitHub"
            className="h-6 w-6 object-contain logo-nebula-mint"
          />
        );
      default:
        return (
          <img
            src={contactLogo}
            alt="Contact"
            className="h-6 w-6 object-contain logo-nebula-mint"
          />
        );
    }
  };

  const getLink = (method) => {
    switch (method.type.toLowerCase()) {
      case "email":
        return `mailto:${method.value}`;
      case "linkedin":
        return `https://linkedin.com/in/${method.value}`;
      case "github":
        return `https://github.com/${method.value}`;
      case "phone":
        return `tel:${method.value}`;
      default:
        return "#";
    }
  };

  return (
    <SectionWrapper
      id="contact"
      title={contact.title}
      icon={icon}
      description={contact.subtitle}
      prevSectionId="certificates"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {contact.methods.map((method) => (
          <a
            key={method.id}
            href={getLink(method)}
            target={method.type.toLowerCase() === "email" ? "_self" : "_blank"}
            rel={
              method.type.toLowerCase() === "email" ? "" : "noopener noreferrer"
            }
            className="group hover:scale-105 transition-transform duration-300 p-6"
          >
            <div className="space-y-4 text-center">
              <div className="p-4 bg-stellar-blue/20 rounded-lg inline-block">
                <div className="text-stellar-blue">{getIcon(method.type)}</div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-nebula-mint">
                  {method.type}
                </h3>
                <p className="text-nebula-mint/80">{method.value}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
