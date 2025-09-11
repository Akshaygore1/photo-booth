import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FormSideFrame from "../components/FormSideFrame";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
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
          <div className="text-2xl mb-6">Join Textie</div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="name" className="block text-base mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:none focus:border-border focus:bg-transparent ${
                  validationErrors.name ? "border-red-400" : "border-border"
                }`}
                required
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-base mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:none focus:border-border focus:bg-transparent ${
                  validationErrors.email ? "border-red-400" : "border-border"
                }`}
                required
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-base mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:none focus:border-border focus:bg-transparent ${
                  validationErrors.password ? "border-red-400" : "border-border"
                }`}
                required
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-base mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:none focus:border-border focus:bg-transparent ${
                  validationErrors.confirmPassword
                    ? "border-red-400"
                    : "border-border"
                }`}
                required
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-primary hover:bg-secondary disabled:bg-secondary text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-zinc-200">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-secondary underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
