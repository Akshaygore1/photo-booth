import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import FormSideFrame from "../components/FormSideFrame";
import { useAuth } from "../hooks/useAuth";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    // If no userId or secret in URL params, redirect to forgot password
    if (!userId || !secret) {
      navigate("/forgot-password");
    }
  }, [userId, secret, navigate]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(pwd)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!userId || !secret) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    try {
      await resetPassword(userId, secret, password);
      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successful. Please log in with your new password." }
        });
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please try again or request a new reset link."
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex">
        <FormSideFrame />

        <div className="w-full lg:w-1/2 flex items-center justify-center text-neutral-100 p-6">
          <div className="max-w-md w-full rounded-lg shadow-md p-6 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl mb-4">Password Reset Successful!</h2>
              <p className="text-zinc-300 mb-6">
                Your password has been successfully updated. You will be redirected to the login page shortly.
              </p>
            </div>

            <Link
              to="/login"
              className="w-full inline-block text-center bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <FormSideFrame />

      <div className="w-full lg:w-1/2 flex items-center justify-center text-neutral-100 p-6">
        <div className="max-w-md w-full rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl mb-2">Set New Password</h2>
            <p className="text-zinc-300 text-sm">
              Enter your new password below. Make sure it's strong and secure.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="password" className="block text-base mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-border rounded-md focus:outline-none focus:bg-transparent focus:border-border"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-base mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-border rounded-md focus:outline-none focus:bg-transparent focus:border-border"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-primary hover:bg-secondary disabled:bg-secondary text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : null}
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>

          <div className="mt-6 text-center text-base">
            <p className="text-zinc-200">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-secondary ml-2 underline"
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

export default ResetPassword;
