import { ChevronDown, ChevronUp } from "lucide-react";

const ScrollArrow = ({
  nextSectionId,
  prevSectionId,
  direction = "down",
  className = "",
}) => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Get navbar height (64px = h-16)
      const navbarHeight = 64;

      // Calculate the position to scroll to
      const elementTop = section.offsetTop;
      const offsetPosition = elementTop - navbarHeight - 20; // 20px additional padding

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleClick = () => {
    if (direction === "up" && prevSectionId) {
      scrollToSection(prevSectionId);
    } else if (direction === "down" && nextSectionId) {
      scrollToSection(nextSectionId);
    }
  };

  const isUpward = direction === "up";
  const sectionId = isUpward ? prevSectionId : nextSectionId;
  const positionClass = isUpward ? "top-32" : "bottom-16";

  if (!sectionId) return null;

  return (
    <div
      className={`absolute ${positionClass} left-1/2 transform -translate-x-1/2 ${className}`}
    >
      <button
        onClick={handleClick}
        className="text-nebula-mint hover:text-stellar-blue transition-colors duration-300 animate-bounce"
        aria-label={`Scroll to ${sectionId} section`}
      >
        {isUpward ? (
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ScrollArrow;
