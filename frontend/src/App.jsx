import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ReviewerDashboard from './pages/ReviewerDashboard';
import ScholarshipCommitteeDashboard from "./pages/ScholarshipCommitteeDashboard";
import ResetPassword from "./pages/ResetPassword"

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/student-dashboard" element={<div><h1>Welcome Student!</h1></div>} />
        <Route path="/admin-dashboard" element={<div><h1>Welcome Admin!</h1></div>} />
        <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />
        <Route path="/scholarship-committee-dashboard" element={<ScholarshipCommitteeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
