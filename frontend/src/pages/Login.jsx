import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import graduationHat from "../assets/graduationHat.svg";

const ROLE_DASHBOARD_PATHS = {
  STUDENT: "/student-dashboard",
  ADMIN: "/admin/users",
  COMMITTEE: "/scholarship-committee-dashboard",
  REVIEWER: "/reviewer-dashboard",
};

const Login = () => {
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const path = ROLE_DASHBOARD_PATHS[currentUser.role] || "/";
      navigate(path, { replace: true });
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // --- FRONTEND VALIDATION ---
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const user = await login(formData.email, formData.password);
      const path = ROLE_DASHBOARD_PATHS[user.role] || "/";
      navigate(path, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600 font-medium">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              className="block text-sm font-bold text-gray-900 mb-2"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition placeholder-gray-300"
              required // Browser default validation
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                className="block text-sm font-bold text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <a
                href="/reset-password"
                className="text-sm font-bold text-blue-700 hover:underline"
              >
                forgot password
              </a>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition placeholder-gray-300"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#1e3a8a] text-white font-bold py-3 rounded-lg cursor-pointer hover:bg-indigo-800 transition duration-300 shadow-md ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-gray-900">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-700 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* RIGHT SIDE - IMAGE/GRADIENT */}
      <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-[#4ade80] to-[#1e3a8a]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6ee7b7] via-[#3b82f6] to-[#1e3a8a]"></div>

        <div className="relative w-full h-full flex items-center justify-center rounded-tl-[100px] rounded-bl-[100px] overflow-hidden z-10">
          <img src={graduationHat} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default Login;
