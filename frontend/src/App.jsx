import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import Context

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ScholarshipCommitteeDashboard from './pages/ScholarshipCommitteeDashboard';
import ReviewerDashboard from "./pages/ReviewerDashboard"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <div className="p-10 text-center text-red-600 font-bold">Access Denied: Insufficient Permissions</div>;
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
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Committee Routes */}
          <Route path="/scholarship-committee-dashboard" element={
            <ProtectedRoute allowedRoles={['COMMITTEE']}>
              <ScholarshipCommitteeDashboard />
            </ProtectedRoute>
          } />


          {/* reviewer Routes */}
          <Route path="/reviewer-dashboard" element={
            <ProtectedRoute allowedRoles={['COMMITTEE']}>
              <ReviewerDashboard />
            </ProtectedRoute>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
