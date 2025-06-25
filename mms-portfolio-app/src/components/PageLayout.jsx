import NavBar from "./NavBar";
import Footer from "./Footer";

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-deep-space relative overflow-hidden">
      {/* Star field background for entire page */}
      <div className="absolute inset-0 star-field opacity-20"></div>

      {/* Content */}
      <div className="relative z-10">
        <NavBar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
