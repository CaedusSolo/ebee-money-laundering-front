import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/AuthService.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on page load
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await AuthService.login(email, password);
      setCurrentUser(data);
      return data; // Return data so the component can decide where to redirect
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    window.location.href = '/login'; // Hard redirect to clear any sensitive state
  };

  const register = async (studentData) => {
      return await AuthService.registerStudent(studentData);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
