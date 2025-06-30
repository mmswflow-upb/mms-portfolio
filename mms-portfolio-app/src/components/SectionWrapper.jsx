import ScrollArrow from "./ScrollArrow";

const SectionWrapper = ({
  id,
  title,
  icon,
  description,
  children,
  className = "",
  backgroundClass = "",
  nextSectionId,
  prevSectionId,
  showArrow = true,
}) => {
  return (
    <section
      id={id}
      className={`py-16 sm:py-20 md:py-24 relative ${backgroundClass} ${className}`}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section Header - Outside the card */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="text-nebula-mint [&>img]:logo-nebula-mint">
              {icon}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-nebula-mint">
              {title}
            </h2>
          </div>
          {description && (
            <p className="text-nebula-mint/80 max-w-2xl mx-auto text-base sm:text-lg px-2">
              {description}
            </p>
          )}
        </div>

        {/* Section Content - Only this is contained in the card */}
        <div className="card">{children}</div>
      </div>

      {/* Scroll Arrows - Only show if showArrow is true */}
      {showArrow && (
        <>
          {/* Up Arrow */}
          {prevSectionId && (
            <ScrollArrow direction="up" prevSectionId={prevSectionId} />
          )}

          {/* Down Arrow */}
          {nextSectionId && (
            <ScrollArrow direction="down" nextSectionId={nextSectionId} />
          )}
        </>
      )}
    </section>
  );
};

export default SectionWrapper;
