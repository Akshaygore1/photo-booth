import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FormSideFrame from "../components/FormSideFrame";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get success message from location state (e.g., from password reset)
  const successMessage = (location.state as { message?: string })?.message;

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Image Section - Hidden on mobile, visible on lg+ screens */}

      <FormSideFrame />

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center text-neutral-100 p-6">
        <div className="max-w-md w-full rounded-lg shadow-md p-6">
          <div className="text-2xl mb-6">Sign in</div>

          <form onSubmit={handleSubmit}>
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-base mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:none focus:bg-transparent focus:border-border"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-base mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:none focus:bg-transparent focus:border-border"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-primary hover:bg-secondary disabled:bg-secondary text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-secondary underline"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-6 text-center text-base space-y-3">
            <p className="text-zinc-200">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:secondary ml-2 underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
