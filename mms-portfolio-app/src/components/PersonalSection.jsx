import { useData } from "../contexts/DataContext";
import { useEffect } from "react";
import ScrollArrow from "./ScrollArrow";
import LabelCard from "./cards/LabelCard";

const PersonalSection = () => {
  const { data } = useData();
  const { personal } = data;

  useEffect(() => {
    // Prevent scrolling above the personal section
    const handleScroll = () => {
      if (window.scrollY < 0) {
        window.scrollTo(0, 0);
      }
    };

    // Ensure the page starts at the top
    window.scrollTo(0, 0);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="personal"
      className="min-h-screen flex flex-col justify-center relative"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Personal Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-nebula-mint">Hi, I'm </span>
                <span className="gradient-text">{personal.name}</span>
              </h1>
              <p className="text-lg text-nebula-mint/80 max-w-lg">
                {personal.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {personal.languages.map((lang, index) => (
                <LabelCard key={index} label={lang} onClick={() => {}} />
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-nebula-mint/60">
                📍 {personal.location}
              </span>
              <span className="text-nebula-mint/60">🚀 {personal.passion}</span>
            </div>
          </div>

          {/* Right side - Code Sample */}
          <div className="card p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-nebula-mint/60 text-sm ml-2">
                  developer.json
                </span>
              </div>

              <pre className="text-sm text-nebula-mint overflow-x-auto whitespace-pre-wrap">
                <code>{`{
  "name": "${personal.name}",
  "role": "${personal.role}",
  "location": "${personal.location}",
  "languages": [
    ${personal.languages.map((lang) => `"${lang}"`).join(",\n    ")}
  ],
  "passion": "${personal.passion}"
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Arrow */}
      <ScrollArrow direction="down" nextSectionId="experience" />
    </section>
  );
};

export default PersonalSection;
