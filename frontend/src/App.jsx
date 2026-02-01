import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ReviewerDashboard from './components/ReviewerDashboard';
import ScholarshipCommitteeDashboard from "./components/ScholarshipCommitteeDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Placeholder for Dashboard (we'll build this next) */}
        <Route path="/student-dashboard" element={<div><h1>Welcome Student!</h1></div>} />
        <Route path="/admin-dashboard" element={<div><h1>Welcome Admin!</h1></div>} />
        <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />
        <Route path="/scholarship-committee-dashboard" element={<ScholarshipCommitteeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
