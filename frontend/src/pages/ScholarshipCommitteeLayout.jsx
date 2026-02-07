import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "../components/Navbar";
import personPlaceholder from "../assets/personPlaceholder.svg";
import { useAuth } from '../context/AuthContext';

export default function ScholarshipCommitteeLayout() {
  const { currentUser } = useAuth();
  const [committeeInfo, setCommitteeInfo] = useState(null);

  // Fetch shared profile data once for the layout
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = currentUser?.user?.id || currentUser?.id || 1;
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/committee/dashboard/${id}`, {
          headers: { 'Authorization': `Bearer ${currentUser?.token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setCommitteeInfo(data.profile);
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
      }
    };
    if (currentUser) fetchProfile();
  }, [currentUser]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="space-y-8">
          {/* Modular Profile Header */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between border border-gray-100">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-100">
                <img src={personPlaceholder} alt="Profile" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase">
                  {currentUser?.user?.name || currentUser?.name || "Committee Member"}
                </h2>
                <p className="text-blue-800 font-semibold text-sm">
                  {committeeInfo?.assignedScholarship || "Scholarship Committee"}
                </p>
                <p className="text-gray-500 text-sm mt-1">{currentUser?.user?.email || currentUser?.email}</p>
              </div>
            </div>
          </div>

          {/* This renders the specific dashboard content (Applications, etc.) */}
          <Outlet context={{ committeeInfo }} />
        </div>
      </main>
    </div>
  );
}
