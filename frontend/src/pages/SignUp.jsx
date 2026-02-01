import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import graduationHat from "../assets/graduationHat.svg"

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration Successful! Please Login.');
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-24 overflow-y-auto">
        <div className="mb-6 mt-10 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">Further Your Journey: Get Started Now</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter your name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-gray-300"
              required
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="studentId">
              Student ID
            </label>
            <input
              type="text"
              name="studentId"
              id="studentId"
              placeholder="Enter your student ID"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-gray-300"
              required
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="email">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-gray-300"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-gray-300"
              required
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreeToTerms"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm font-bold text-gray-900">
              I agree to the <a href="/terms-and-policy" className="underline">terms & policy</a>
            </label>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-[#1e3a8a] text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition duration-300 shadow-md"
          >
            Signup
          </button>
        </form>

        <p className="mt-6 mb-10 text-center text-sm font-bold text-gray-900">
          Have an account?{' '}
          <Link to="/login" className="text-blue-700 hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      {/* RIGHT SIDE - IMAGE/GRADIENT */}
      <div className="hidden md:flex w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6ee7b7] via-[#3b82f6] to-[#1e3a8a]"></div>

        <div className="relative w-full h-full flex items-center justify-center rounded-tl-[100px] rounded-bl-[100px] overflow-hidden z-10">
           <div className="w-full h-full flex items-center justify-center opacity-30">
            <img src={graduationHat} alt="Logo" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
