import { useState } from "react";

const LabelCard = ({ label, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-full text-nebula-mint text-sm transition-all duration-300 hover:bg-cosmic-purple/40 hover:border-cosmic-purple/60 hover:scale-105 hover:shadow-lg hover:shadow-cosmic-purple/20 ${className}`}
    >
      {label}
    </button>
  );
};

export default LabelCard;
