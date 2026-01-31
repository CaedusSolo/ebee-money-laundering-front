import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Student Registration</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <input type="text" name="studentId" onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 font-bold text-white rounded hover:bg-blue-700 transition duration-200 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
          >
             {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
