import React from "react";

function AdminSectionWrapper({ id, title, icon, description, children }) {
  return (
    <section id={id} className="mt-16 flex flex-col justify-start relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="text-nebula-mint">{icon}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-nebula-mint">
              {title}
            </h2>
          </div>
          {description && (
            <p className="text-nebula-mint/80 max-w-2xl mx-auto text-lg">
              {description}
            </p>
          )}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

export default AdminSectionWrapper;
