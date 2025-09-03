import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import FormSideFrame from "../components/FormSideFrame";
import { useAuth } from "../hooks/useAuth";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await forgotPassword(email);
      setMessage(
        "If an account with this email exists, you will receive a password reset link shortly."
      );
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Please try again."
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex">
        <FormSideFrame />

        <div className="w-full lg:w-1/2 flex items-center justify-center text-neutral-100 p-6">
          <div className="max-w-md w-full rounded-lg shadow-md p-6 text-center">
            <div className="mb-6">
              <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl mb-4">Check your email</h2>
              <p className="text-zinc-300 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-zinc-400 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                  setMessage("");
                }}
                className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Try again
              </button>

              <Link
                to="/login"
                className="w-full inline-block text-center bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold py-2 px-4 rounded-md border border-zinc-600 hover:border-zinc-500 transition duration-300"
              >
                Back to login
              </Link>
            </div>
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
            <Link
              to="/login"
              className="inline-flex items-center text-zinc-300 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
            <h2 className="text-2xl mb-2">Reset your password</h2>
            <p className="text-zinc-300 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {message}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="email" className="block text-base mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:bg-transparent focus:border-border"
                placeholder="Enter your email address"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-primary hover:bg-secondary disabled:bg-secondary text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              {loading ? "Sending..." : "Send reset link"}
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

export default ForgotPassword;
