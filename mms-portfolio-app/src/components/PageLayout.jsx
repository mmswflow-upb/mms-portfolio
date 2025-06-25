import NavBar from "./NavBar";
import Footer from "./Footer";

const PageLayout = ({ children, isEditMode = false }) => {
  return (
    <div className="min-h-screen bg-deep-space relative overflow-hidden flex flex-col">
      {/* Star field background for entire page */}
      <div className="absolute inset-0 star-field opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <NavBar isEditMode={isEditMode} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
