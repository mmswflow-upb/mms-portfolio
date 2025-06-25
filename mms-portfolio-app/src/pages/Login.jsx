import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import emailIcon from "../assets/info/email.png";
import padlockIcon from "../assets/info/padlock.png";
import PageLayout from "../components/PageLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Check if user is already logged in and redirect to admin
  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  // Don't render the login form if user is already logged in
  if (user) {
    return null;
  }

  return (
    <PageLayout isEditMode={true}>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md relative z-10">
          <div className="card">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Admin Login
              </h1>
              <p className="text-nebula-mint/60">
                Access the admin panel to manage your portfolio
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-nebula-mint text-sm font-medium"
                >
                  Email
                </label>
                <div className="relative">
                  <img
                    src={emailIcon}
                    alt="Email"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 object-contain opacity-40 logo-nebula-mint"
                  />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint placeholder-nebula-mint/40 focus:outline-none focus:border-stellar-blue transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-nebula-mint text-sm font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <img
                    src={padlockIcon}
                    alt="Password"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 object-contain opacity-40 logo-nebula-mint"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint placeholder-nebula-mint/40 focus:outline-none focus:border-stellar-blue transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-nebula-mint/40 hover:text-nebula-mint transition-colors"
                  >
                    {showPassword ? (
                      <span className="text-sm">Hide</span>
                    ) : (
                      <span className="text-sm">Show</span>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-nebula-mint/60 hover:text-stellar-blue transition-colors text-sm"
              >
                ← Back to Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;
