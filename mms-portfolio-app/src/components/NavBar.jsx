import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import editCodeIcon from "../assets/info/edit-code.png";
import logoutIcon from "../assets/buttons/log-out.png";

const NavBar = ({ isEditMode = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "About", path: "/#personal" },
    { name: "Experience", path: "/#experience" },
    { name: "Organizations", path: "/#organizations" },
    { name: "Education", path: "/#education" },
    { name: "Projects", path: "/#projects" },
    { name: "Certificates", path: "/#certificates" },
    { name: "Contact", path: "/#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const handleNavClick = (e, path) => {
    e.preventDefault();
    const targetId = path.replace("/#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-deep-space/95 backdrop-blur-md border-b border-cosmic-purple/50 shadow-lg shadow-cosmic-purple/20"
          : "bg-deep-space/90 backdrop-blur-sm border-b border-cosmic-purple/30"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold gradient-text">
              &lt;Mohamad-Mario Sakka /&gt;
            </span>
          </Link>

          {/* Desktop Navigation - Hidden in Edit Mode */}
          {!isEditMode && (
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={`text-nebula-mint hover:text-stellar-blue transition-colors duration-300 text-sm ${
                    location.pathname === item.path ? "text-stellar-blue" : ""
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}

          {/* Edit Mode Indicator and Logout - Right Side */}
          {isEditMode && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg px-3 py-1">
                <img
                  src={editCodeIcon}
                  alt="Edit Mode"
                  className="h-4 w-4 object-contain logo-nebula-mint"
                />
                <span className="text-nebula-mint text-sm font-medium">
                  Edit Mode
                </span>
              </div>
              {user && (
                <button
                  onClick={handleLogout}
                  className="text-nebula-mint hover:text-stellar-blue transition-colors duration-300 flex items-center space-x-2"
                >
                  <img
                    src={logoutIcon}
                    alt="Logout"
                    className="h-4 w-4 object-contain logo-nebula-mint"
                  />
                  <span>Logout</span>
                </button>
              )}
            </div>
          )}

          {/* Mobile menu button - Hidden in Edit Mode */}
          {!isEditMode && (
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-nebula-mint hover:text-stellar-blue transition-colors duration-300"
              >
                <span className="sr-only">Toggle menu</span>
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation - Hidden in Edit Mode */}
        {!isEditMode && isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-cosmic-purple/10 border-t border-cosmic-purple/30 max-h-96 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={`block w-full text-left px-3 py-2 text-nebula-mint hover:text-stellar-blue transition-colors duration-300 ${
                    location.pathname === item.path ? "text-stellar-blue" : ""
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
