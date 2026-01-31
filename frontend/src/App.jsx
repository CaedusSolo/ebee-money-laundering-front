import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';

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
      </Routes>
    </Router>
  );
}

export default App;
