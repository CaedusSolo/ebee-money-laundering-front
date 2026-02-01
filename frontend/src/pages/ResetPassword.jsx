import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // Basic Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      // In a real app, you might send this to: await AuthService.resetPassword(formData);
      console.log("Resetting password for:", formData.email);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setStatus({ type: 'success', message: 'Password successfully reset! Redirecting...' });

      // Redirect to login after success
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to reset password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-24">

        {/* Back Link */}
        <Link to="/login" className="flex items-center w-fit text-gray-500 hover:text-blue-900 mb-8 transition">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Login
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600 font-medium">Enter your email and new password to update your credentials.</p>
        </div>

        {/* Status Message */}
        {status.message && (
          <div className={`p-4 mb-6 rounded-lg text-sm font-bold ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email Address */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="email">
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
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition placeholder-gray-300"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition placeholder-gray-300 ${
                formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-900 focus:border-transparent'
              }`}
              required
            />
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#1e3a8a] text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition duration-300 shadow-md mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      </div>

      {/* RIGHT SIDE - VISUAL */}
      <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-[#4ade80] to-[#1e3a8a]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6ee7b7] via-[#3b82f6] to-[#1e3a8a]"></div>
        <div className="relative w-full h-full flex items-center justify-center rounded-tl-[100px] rounded-bl-[100px] overflow-hidden z-10">
           {/* Reusing the visual icon for consistency */}
           <svg className="w-2/3 h-auto text-gray-100 opacity-90 drop-shadow-xl" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
           </svg>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
