import { useEffect } from "react";

const ScrollAnimations = () => {
  useEffect(() => {
    console.log("ScrollAnimations: Starting setup...");

    // Simpler approach using scroll events
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionHeight = rect.height;
        const sectionCenter = sectionTop + sectionHeight / 2;

        // Calculate distance from viewport center
        const viewportCenter = scrollY + viewportHeight / 2;
        const distanceFromCenter = Math.abs(viewportCenter - sectionCenter);
        const maxDistance = viewportHeight;

        // Calculate scale based on distance from center (closer = bigger)
        let scale = 1;
        let opacity = 1;
        let blur = 0;

        if (distanceFromCenter < maxDistance) {
          // Section is near viewport center
          const proximityRatio = 1 - distanceFromCenter / maxDistance;
          scale = 0.7 + proximityRatio * 0.4; // 0.7 to 1.1 (more dramatic)
          opacity = 0.3 + proximityRatio * 0.7; // 0.3 to 1.0
          blur = (1 - proximityRatio) * 5; // 0 to 5px

          // Add extra emphasis when section is perfectly centered
          if (distanceFromCenter < viewportHeight * 0.2) {
            scale += 0.1; // Extra zoom for focused section
          }
        } else {
          // Section is far from viewport
          scale = 0.6; // More dramatic shrink
          opacity = 0.2;
          blur = 6;
        }

        // Apply transformations
        section.style.transform = `scale(${scale})`;
        section.style.opacity = opacity;
        section.style.filter = `blur(${blur}px)`;
        section.style.transition =
          "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-out, filter 0.3s ease-out";
        section.style.transformOrigin = "center center";

        // Debug output for first section
        if (index === 0) {
          console.log(
            `Section ${section.id}: scale=${scale.toFixed(
              2
            )}, opacity=${opacity.toFixed(
              2
            )}, distance=${distanceFromCenter.toFixed(0)}`
          );
        }
      });
    };

    // Initial setup
    const sections = document.querySelectorAll("section[id]");
    console.log(
      `ScrollAnimations: Found ${sections.length} sections:`,
      Array.from(sections).map((s) => s.id)
    );

    // Add scroll listener with throttling for performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      // Reset all sections on cleanup
      sections.forEach((section) => {
        section.style.transform = "";
        section.style.opacity = "";
        section.style.filter = "";
        section.style.transition = "";
      });
    };
  }, []);

  return null;
};

export default ScrollAnimations;
