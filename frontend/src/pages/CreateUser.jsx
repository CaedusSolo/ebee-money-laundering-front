import { useState } from "react";
import Person from "../assets/personPlaceholder.svg";

const ROLES = {
  ADMIN: "admin",
  COMMITTEE: "committee",
  REVIEWER: "reviewer",
  STUDENT: "student",
};

export default function CreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating user:", formData);
    // Handle form submission
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 flex items-center justify-center">
          <img src={Person} alt="" className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* NAME */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* TITLE */}
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1"
            >
              Title<span className="text-red-500">*</span>
            </label>
            <select
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {Object.entries(ROLES).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}
