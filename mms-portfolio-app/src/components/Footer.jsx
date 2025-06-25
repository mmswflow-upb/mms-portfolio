import githubLogo from "../assets/info/github.png";
import linkedinLogo from "../assets/info/linkedin.png";
import emailLogo from "../assets/info/email.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deep-space border-t border-cosmic-purple/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-nebula-mint text-sm">
            © {currentYear} Mario Sakka. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
