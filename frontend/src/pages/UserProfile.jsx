import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserService from "../services/UserService";
import axios from "axios";
import Eye from "../assets/eye.svg";
import File from "../assets/file-text.svg";

function ApplicationCard({ application }) {
  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div className="w-1 h-12 bg-blue-600 rounded-full" />
        <div>
          <h4 className="font-bold text-foreground">
            Scholarship ID: {application.scholarshipID || "N/A"}
          </h4>
          <p className="text-sm text-muted-foreground">
            Status: {application.status || "N/A"}
          </p>
          <p className="text-sm text-muted-foreground">
            Submitted: {formatDate(application.submittedAt)}
          </p>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <img src={Eye} alt="View" className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function UserProfile() {
  const { currentUser } = useAuth();
  const userService = new UserService(currentUser?.token);
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine which user ID to use (from params or current user)
  const targetUserId = userId || currentUser?.id;
  // Check if viewing own profile
  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!targetUserId) {
        setError("No user ID available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await userService.getUserById(targetUserId);
        console.log('User data received:', data);
        console.log('User ID for applications:', data.id);
        setUser(data);
        
        // Fetch applications if user is a student
        // Use data.id (the primary key) which matches Application.studentID
        if (data.role === "STUDENT") {
          const studentId = await userService.getStudentIdByUserId(data.id);
          console.log("Student ID: ", studentId);
          console.log("Fetching applications for student ID:", studentId);
          await fetchApplications(studentId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId]);

  const fetchApplications = async (userId) => {
    try {
      setApplicationsLoading(true);
      
      // Get the base URL and ensure it doesn't include /api/users
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const cleanBaseUrl = baseUrl.replace('/api/users', '').replace('/api', '');
      const apiUrl = `${cleanBaseUrl}/api/applications/student/${userId}`;
      
      console.log('Fetching applications from:', apiUrl); // Debug log
      
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log('Applications received:', response.data); // Debug log
      setApplications(response.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      console.error("Error details:", error.response?.data); // More detailed error
      // Don't set error state, just show empty applications
      setApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleEdit = () => {
    // Navigate to edit page with the user ID
    navigate(`/admin/users/edit/${targetUserId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
      return;
    }

    try {
      await userService.deleteUser(targetUserId);
      alert("Account deleted successfully");
      navigate("/admin/users");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading user profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">{error || "User not found"}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-400">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {user.name || "N/A"}
            </h2>
            <p className="text-sm text-muted-foreground">{user.role || "N/A"}</p>
            <p className="text-sm text-blue-600">{user.email || "N/A"}</p>
          </div>
        </div>
        <button 
          onClick={handleEdit}
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Edit
        </button>
      </div>

      {/* User Details Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-foreground w-1/3">
                Full Name
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {user.name || "N/A"}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-foreground">
                ID
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {user.id || "N/A"}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-foreground">
                Email
              </td>
              <td className="px-4 py-3 text-sm text-blue-600">{user.email || "N/A"}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-foreground">
                Password
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                ••••••••••
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-foreground">
                Role
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {user.role || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Application Status Section - Only show for students */}
      {user.role === "STUDENT" && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={File} alt="Applications" className="w-5 h-5" />
            <h3 className="text-lg font-bold text-foreground">
              Application Status
            </h3>
          </div>
          
          {applicationsLoading ? (
            <div className="text-center py-8 text-gray-600">
              Loading applications...
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app) => (
                <ApplicationCard
                  key={app.applicationID}
                  application={app}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-600">No applications found</p>
              <p className="text-sm text-gray-500 mt-1">
                This student hasn't submitted any scholarship applications yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Delete Account Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleDelete}
          className="border-2 border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
