import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoutIcon from "../assets/buttons/log-out.png";

const NavBar = () => {
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

          {/* Desktop Navigation */}
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
            {user && (
              <div className="flex items-center space-x-4 ml-4">
                <Link
                  to="/admin"
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <img
                    src={logoutIcon}
                    alt="Logout"
                    className="h-4 w-4 object-contain"
                  />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
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
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
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
              {user && (
                <div className="space-y-2 pt-4 border-t border-cosmic-purple/30">
                  <Link
                    to="/admin"
                    className="block px-3 py-2 btn-primary text-center flex items-center gap-2 justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 btn-secondary text-center flex items-center gap-2 justify-center"
                  >
                    <img
                      src={logoutIcon}
                      alt="Logout"
                      className="h-5 w-5 object-contain"
                    />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
