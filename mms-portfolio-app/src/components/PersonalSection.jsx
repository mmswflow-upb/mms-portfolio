import { useData } from "../contexts/DataContext";
import { useEffect, useState } from "react";
import ScrollArrow from "./ScrollArrow";
import LabelCard from "./cards/LabelCard";
import { fetchCommitInfo } from "../services/gitHubApiService";

const PersonalSection = () => {
  const { data } = useData();
  const { personal } = data;
  const [commitInfo, setCommitInfo] = useState(null);
  const [isLoadingCommit, setIsLoadingCommit] = useState(false);

  // Fetch commit information when repository path changes
  useEffect(() => {
    const fetchCommit = async () => {
      if (personal?.repositoryPath) {
        setIsLoadingCommit(true);
        try {
          const info = await fetchCommitInfo(personal.repositoryPath);
          setCommitInfo(info);
        } catch (error) {
          console.error("Error fetching commit info:", error);
          setCommitInfo(null);
        } finally {
          setIsLoadingCommit(false);
        }
      } else {
        setCommitInfo(null);
      }
    };

    fetchCommit();
  }, [personal?.repositoryPath]);

  // Safety check for personal data
  if (!personal) {
    return (
      <section
        id="personal"
        className="min-h-screen flex flex-col justify-center relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <p className="text-nebula-mint/60">
              Loading personal information...
            </p>
          </div>
        </div>
      </section>
    );
  }

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
            {/* Profile Photo - Mobile First */}
            {personal.photo && (
              <div className="lg:hidden flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={personal.photo}
                    alt={personal.preferredName || personal.name || "Profile"}
                    className="w-32 h-32 rounded-full object-cover border-4 border-cosmic-purple/30 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-stellar-blue rounded-full border-2 border-deep-space flex items-center justify-center">
                    <div className="w-4 h-4 bg-nebula-mint rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-nebula-mint">Hi, I'm </span>
                <span className="gradient-text">
                  {personal.preferredName || personal.name || "Developer"}
                </span>
              </h1>
              <p className="text-lg text-nebula-mint/80 max-w-lg">
                {personal.description ||
                  "Full-stack developer passionate about creating innovative solutions."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <LabelCard
                label={personal.role || "Full Stack Developer"}
                onClick={() => {}}
              />
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-nebula-mint/60">
                📍 {personal.location || "Location"}
              </span>
              <span className="text-nebula-mint/60">
                🚀 {personal.passion || "Building the future"}
              </span>
            </div>
          </div>

          {/* Right side - Profile Photo (Desktop) and Code Sample */}
          <div className="space-y-6">
            {/* GitHub-style commit/info card */}
            <div className="w-full bg-deep-space border border-cosmic-purple/30 rounded-xl p-4 flex items-center gap-4 shadow-md mb-4">
              <img
                src={personal.photo}
                alt={personal.preferredName || personal.name || "Profile"}
                className="w-24 h-24 rounded-full object-cover border-2 border-cosmic-purple/40 shadow"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-nebula-mint">
                    {personal.preferredName || personal.name || "You"}
                  </span>
                  <span className="text-xs text-nebula-mint/60">
                    {(() => {
                      // Use commit date if available, otherwise show current date
                      const date = commitInfo?.date
                        ? new Date(commitInfo.date)
                        : new Date();
                      const now = new Date();
                      const diffMs = now - date;
                      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                      const diffDays = Math.floor(
                        diffMs / (1000 * 60 * 60 * 24)
                      );

                      if (diffHrs < 24) {
                        return `${
                          diffHrs === 0
                            ? "Just now"
                            : diffHrs +
                              " hour" +
                              (diffHrs > 1 ? "s" : "") +
                              " ago"
                        }`;
                      } else if (diffDays < 7) {
                        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
                      } else {
                        return date.toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      }
                    })()}
                  </span>
                  <span className="text-xs text-nebula-mint/40 italic">
                    (Portfolio v1.0)
                  </span>
                </div>
                <div className="text-nebula-mint/80 truncate text-sm mt-1">
                  {isLoadingCommit ? (
                    "Loading commit info..."
                  ) : commitInfo ? (
                    <div className="flex items-center gap-2">
                      <span className="text-stellar-blue font-mono text-xs">
                        {commitInfo.sha}
                      </span>
                      <a
                        href={commitInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-stellar-blue transition-colors"
                      >
                        {commitInfo.message}
                      </a>
                    </div>
                  ) : (
                    "Almost finished building portfolio components"
                  )}
                </div>
              </div>
            </div>

            {/* Code Sample */}
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
                  <code>
                    {/* GitHub-style comment */}
                    <span className="text-nebula-mint/60">
                      // Last edited by{" "}
                      {personal.preferredName || personal.name || "Developer"}
                    </span>
                    <span className="text-nebula-mint/60">
                      //{" "}
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-nebula-mint/60">
                      // Portfolio v1.0
                    </span>
                    <br />
                    {personal.codeSample ||
                      `{
  "name": "${personal.fullName || personal.name || "Developer"}",
  "role": "${personal.role || "Full Stack Developer"}",
  "location": "${personal.location || "Location"}",
  "languages": [
    ${(personal.languages || []).map((lang) => `"${lang}"`).join(",\n    ")}
  ],
  "passion": "${personal.passion || "Building the future"}"
}`}
                  </code>
                </pre>
              </div>
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
