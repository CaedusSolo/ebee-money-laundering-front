import React, { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Account created! Redirecting to login...');
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Connection failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Get Started Now</h2>

        {message && <div className={`p-2 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <input type="text" name="studentId" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input type="email" name="email" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
          </div>
          <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Signup
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Have an account? <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
