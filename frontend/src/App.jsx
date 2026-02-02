import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import Context

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import ScholarshipCommitteeDashboard from "./pages/ScholarshipCommitteeDashboard";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import TermsAndPolicy from "./pages/TermsAndPolicy";
import ApplicationForm from "./pages/ApplicationForm";
import ScholarshipsList from "./pages/ScholarshipsList";
import AdminLayout from "./pages/AdminLayout";
import ManageUsers from "./pages/ManageUsers";
import EditUser from "./pages/EditUsers";
import ScholarshipCommitteeLayout from "./pages/ScholarshipCommitteeLayout"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        Access Denied: Insufficient Permissions
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/terms-and-policy" element={<TermsAndPolicy />} />

          {/* Committee Routes */}
          <Route
            path="scholarship-committee-dashboard"
            element={
              <ProtectedRoute allowedRoles={["COMMITTEE"]}>
                <ScholarshipCommitteeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ScholarshipCommitteeDashboard />} />
          </Route>

          {/* reviewer Routes */}
          <Route
            path="/reviewer-dashboard"
            element={
              <ProtectedRoute allowedRoles={["REVIEWER"]}>
                <ReviewerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Scholarship/Applications Routes */}
          <Route path="/student-dashboard" element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <ScholarshipsList />
            </ProtectedRoute>
          } />

          <Route path="application-form" element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <ApplicationForm />
            </ProtectedRoute>
          }
            />

          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="edit-user/:userId" element={<EditUser />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
