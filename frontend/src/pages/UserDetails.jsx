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
  const { userId } = useParams();
  const isEditMode = Boolean(userId);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    password: "",
    email: "",
    studentId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const data = await userService.getUserById(userId);
        setFormData({
          name: data.name || "",
          role: data.role || "",
          password: "",
          email: data.email || "",
          studentId: data.studentId || "",
        });
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const validateForm = () => {
    let newErrors = {};
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    const formatA = /^12\d{8}$/;
    const formatB = /^2\d{2}[a-zA-Z]{2}\d{3}[a-zA-Z0-9]{2}$/;

    // 1. Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    } else if (formData.name.trim().length < 4) {
      newErrors.name = "Full Name must be at least 4 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Full Name must contain only letters and spaces";
    }

    // 2. Role Validation
    if (!formData.role) {
      newErrors.role = "User role is required";
    }

    // 3. Student ID Validation (Only for STUDENT role)
    if (formData.role === ROLES.STUDENT) {
      if (!formData.studentId) {
        newErrors.studentId = "Student ID is required";
      } else if (!formatA.test(formData.studentId) && !formatB.test(formData.studentId)) {
        newErrors.studentId = "Invalid Format. Use '12xxxxxxxx' or '2xxLLNNNXX'";
      }
    }

    // 4. Email Validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Must be a valid Gmail address (@gmail.com)";
    }

    // 5. Password Validation (Required for new, validated if typed in edit)
    const password = formData.password;
    if (!isEditMode && !password) {
      newErrors.password = "Password is required";
    } else if (password) {
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

    setValidationErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setError("Please fix the errors highlighted below.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditMode) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userService.updateUser(userId, updateData);
      } else {
        await userService.createUser(formData);
      }
      navigate("/admin/users");
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError(msg.includes("Email") ? "This email is already registered." : `Failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.email) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <div className="text-gray-600 animate-pulse font-medium">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between w-full py-8 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-5">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <img src={Person} alt="" className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit User Account" : "Add New User Account"}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {/* NAME */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    validationErrors.name ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="Enter full name"
                />
                {validationErrors.name && <span className="text-xs text-red-500 font-medium">{validationErrors.name}</span>}
              </div>

              {/* ROLE */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">User Role*</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white ${
                    validationErrors.role ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <option value="">Select a role</option>
                  {Object.entries(ROLES).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
                {validationErrors.role && <span className="text-xs text-red-500 font-medium">{validationErrors.role}</span>}
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Gmail Address*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    validationErrors.email ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                  placeholder="example@gmail.com"
                />
                {validationErrors.email && <span className="text-xs text-red-500 font-medium">{validationErrors.email}</span>}
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Password{!isEditMode && "*"}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEditMode ? "Min 8 chars, 1 Cap, 1 Num, 1 Symbol" : "Enter password"}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    validationErrors.password ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                />
                {validationErrors.password && <span className="text-xs text-red-500 font-medium">{validationErrors.password}</span>}
              </div>

              {/* STUDENT ID */}
              {formData.role === ROLES.STUDENT && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Student ID*</label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="12xxxxxxxx or 2xxLLNNNXX"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                      validationErrors.studentId ? "border-red-500 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {validationErrors.studentId && <span className="text-xs text-red-500 font-medium">{validationErrors.studentId}</span>}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-50">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 shadow-md"
              >
                {loading ? "Processing..." : isEditMode ? "Save Changes" : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
