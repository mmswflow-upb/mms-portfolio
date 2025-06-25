import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Settings } from "lucide-react";

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-deep-space">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
            <p className="text-nebula-mint/60">Welcome back, {user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center space-x-2"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Admin Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-6 w-6 text-stellar-blue" />
              <h3 className="text-xl font-bold text-nebula-mint">
                Personal Info
              </h3>
            </div>
            <p className="text-nebula-mint/60 mb-4">
              Manage your personal information and profile details.
            </p>
            <button className="btn-primary w-full">Edit Personal Info</button>
          </div>

          {/* Experience */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-6 w-6 text-stellar-blue" />
              <h3 className="text-xl font-bold text-nebula-mint">Experience</h3>
            </div>
            <p className="text-nebula-mint/60 mb-4">
              Add, edit, or remove work experience entries.
            </p>
            <button className="btn-primary w-full">Manage Experience</button>
          </div>

          {/* Projects */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-6 w-6 text-stellar-blue" />
              <h3 className="text-xl font-bold text-nebula-mint">Projects</h3>
            </div>
            <p className="text-nebula-mint/60 mb-4">
              Manage your portfolio projects and showcase.
            </p>
            <button className="btn-primary w-full">Manage Projects</button>
          </div>

          {/* Education */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-6 w-6 text-stellar-blue" />
              <h3 className="text-xl font-bold text-nebula-mint">Education</h3>
            </div>
            <p className="text-nebula-mint/60 mb-4">
              Update your educational background and achievements.
            </p>
            <button className="btn-primary w-full">Manage Education</button>
          </div>

          {/* Certificates */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-6 w-6 text-stellar-blue" />
              <h3 className="text-xl font-bold text-nebula-mint">
                Certificates
              </h3>
            </div>
            <p className="text-nebula-mint/60 mb-4">
              Manage your professional certifications.
            </p>
            <button className="btn-primary w-full">Manage Certificates</button>
          </div>

          {/* Contact */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-6 w-6 text-stellar-blue" />
              <h3 className="text-xl font-bold text-nebula-mint">Contact</h3>
            </div>
            <p className="text-nebula-mint/60 mb-4">
              Update your contact information and methods.
            </p>
            <button className="btn-primary w-full">Manage Contact</button>
          </div>
        </div>

        {/* Back to Portfolio */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-nebula-mint/60 hover:text-stellar-blue transition-colors"
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default Admin;
