import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { auth as authApi } from "../services/api";

export default function Login() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotMessage("");
    try {
      await authApi.sendMagicLink(forgotEmail);
      setForgotMessage("Magic link sent! Check your email to sign in.");
    } catch (err) {
      setForgotMessage(err.message || "Failed to send link. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/home` },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(loginId, password);

    if (result.success) {
      navigate("/events");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Logo and Tagline */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
        {/* Stacked Images Background - 3 Row Landscape */}
        <div className="absolute inset-0 flex flex-col">
          <img
            src="/login-dj.png"
            alt="DJ"
            className="w-full h-1/3 object-cover"
          />
          <img
            src="/login-crowd1.png"
            alt="Crowd"
            className="w-full h-1/3 object-cover"
          />
          <img
            src="/login-guitarist.png"
            alt="Guitarist"
            className="w-full h-1/3 object-cover"
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <img
              src="/m-logo.png"
              alt="MuWave Logo"
              className="w-32 h-32 mx-auto object-contain"
            />
          </div>
          <h1
            className="text-4xl font-extrabold text-white mb-2"
            style={{ fontFamily: "Syne, sans-serif", letterSpacing: "2px" }}
          >
            MUWAVE
          </h1>
          <p className="text-xl text-white/90">Matching and event Discovery</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-block">
              <img
                src="/m-logo.png"
                alt="MuWave Logo"
                className="w-24 h-24 mx-auto object-contain"
              />
            </Link>
            <h1
              className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2"
              style={{ fontFamily: "Syne, sans-serif", letterSpacing: "2px" }}
            >
              MUWAVE
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Matching and event Discovery
            </p>
          </div>

          {/* Jump Back In Heading */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Jump back in
            </h2>
          </div>

          {/* Login Card */}
          <div className="card p-8 space-y-6 shadow-2xl rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Email or Username Input */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="Email or Username"
                  className="input-field w-full"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="input-field w-full"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary w-full py-3"
                disabled={loading}
              >
                {loading ? "Signing in..." : "LOG IN"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgot(!showForgot)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600"
                >
                  Forgot Password?
                </button>
              </div>

              {showForgot && (
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  {forgotMessage && (
                    <p
                      className={`text-sm ${forgotMessage.includes("sent") ? "text-green-600" : "text-red-600"}`}
                    >
                      {forgotMessage}
                    </p>
                  )}
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="input-field w-full"
                  />
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                    className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg text-sm disabled:opacity-50"
                  >
                    {forgotLoading ? "Sending..." : "Send Magic Link"}
                  </button>
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
                  Or sign in with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn-secondary py-3 flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 48 48" className="w-5 h-5">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-orange-600 hover:text-orange-700 font-bold"
              >
                Register
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
