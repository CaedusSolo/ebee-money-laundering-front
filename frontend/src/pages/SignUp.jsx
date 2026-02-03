import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import graduationHat from "../assets/graduationHat.svg";

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;

  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    } else if (formData.name.trim().length < 4) {
        newErrors.name = "Full Name must be at least 4 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
        newErrors.name = "Full Name must contain only letters and spaces";
    }

    const formatA = /^12\d{8}$/;
    const formatB = /^2\d{2}[a-zA-Z]{2}\d{3}[a-zA-Z0-9]{2}$/;

    if (!formData.studentId) {
      newErrors.studentId = "Student ID is required";
    } else if (!formatA.test(formData.studentId) && !formatB.test(formData.studentId)) {
      newErrors.studentId = "Invalid Format. Use '12xxxxxxxx' or '2xxLLNNNXX'";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Must be a valid Gmail address (@gmail.com)";
    }

    const password = formData.password;
    if (!password) {
      newErrors.password = "Password is required";
    } else {
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = "Password must contain at least 1 Uppercase letter";
      } else if (!/\d/.test(password)) {
        newErrors.password = "Password must contain at least 1 Number";
      } else if (!/[@$!%*?&#.]/.test(password)) {
        newErrors.password = "Password must contain 1 Special Symbol (@$!%*?&#.)";
      }
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await register(formData);
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message || 'Registration failed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-24 overflow-y-auto">
        <div className="mb-6 mt-10 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">Get Started with Gmail</h1>
        </div>

        {errors.general && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="name">Full Name</label>
            <input type="text" name="name" id="name" placeholder="Enter your name"
              value={formData.name} onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-gray-300 transition-colors ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="studentId">Student ID</label>
            <input type="text" name="studentId" id="studentId" placeholder="1211001122 or 241AB123CD"
              value={formData.studentId} onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-gray-300 transition-colors ${errors.studentId ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
            {errors.studentId && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.studentId}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="email">Gmail address</label>
            <input type="email" name="email" id="email" placeholder="example@gmail.com"
              value={formData.email} onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-gray-300 transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1" htmlFor="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Min 8 chars, 1 Cap, 1 Num, 1 Symbol"
              value={formData.password} onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 placeholder-gray-300 transition-colors ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} />
            {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password}</p>}
          </div>

          <div>
            <div className="flex items-center">
              <input type="checkbox" name="agreeToTerms" id="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange}
                className="h-4 w-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900" />
              <label htmlFor="agreeToTerms" className={`ml-2 block text-sm font-bold ${errors.agreeToTerms ? 'text-red-500' : 'text-gray-900'}`}>
                I agree to the <a href="/terms-and-policy" className="underline font-bold text-blue-700">terms & policy</a>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1 ml-6 font-semibold">{errors.agreeToTerms}</p>}
          </div>

          <button type="submit" disabled={loading}
            className={`w-full bg-[#1e3a8a] text-white cursor-pointer font-bold py-3 rounded-lg hover:bg-blue-900 transition duration-300 shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {loading ? 'Creating Account...' : 'Signup'}
          </button>
        </form>

        <p className="mt-6 mb-10 text-center text-sm font-bold text-gray-900">
          Have an account? <Link to="/login" className="text-blue-700 hover:underline">Sign In</Link>
        </p>
      </div>

      <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-[#6ee7b7] via-[#3b82f6] to-[#1e3a8a]">
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
