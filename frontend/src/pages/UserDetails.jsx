import { useState, useEffect } from "react";
import Person from "../assets/personPlaceholder.svg";
import UserService from "../services/UserService";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const ROLES = {
  ADMIN: "ADMIN",
  COMMITTEE: "COMMITTEE",
  REVIEWER: "REVIEWER",
  STUDENT: "STUDENT",
};

export default function UserDetails() {
  const { currentUser } = useAuth();
  const userService = new UserService(currentUser?.token);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    password: "",
    email: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userId } = useParams();
  const isEditMode = Boolean(userId);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const data = await userService.getUserById(userId);
        setFormData({
          name: data.name || "",
          role: data.role || "",
          password: "", // Don't populate password for security
          email: data.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        // Update existing user
        const updateData = { ...formData };
        // Only include password if it's been changed
        if (!updateData.password) {
          delete updateData.password;
        }
        
        await userService.updateUser(userId, updateData);
        console.log("User updated successfully");
      } else {
        // Create new user
        await userService.createUser(formData);
        console.log("User created successfully");
      }
      
      navigate("/admin/users");
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} user:`, error);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} user. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.email) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading user data...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 flex items-center justify-center">
          <img src={Person} alt="" className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditMode ? "Edit User" : "Create New User"}
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* NAME */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1"
            >
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* ROLE */}
          <div>
            <label
              htmlFor="role"
              className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1"
            >
              Role<span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select a role</option>
              {Object.entries(ROLES).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1"
            >
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1"
            >
              Password{!isEditMode && <span className="text-red-500">*</span>}
              {isEditMode && <span className="text-xs text-gray-500 normal-case ml-2">(Leave blank to keep current)</span>}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditMode}
              placeholder={isEditMode ? "Enter new password to change" : ""}
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : isEditMode ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
