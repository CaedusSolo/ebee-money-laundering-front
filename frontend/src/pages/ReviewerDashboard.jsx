import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import personPlaceholder from '../assets/personPlaceholder.svg';
import ApplicationsList from '../components/ApplicationsList';
import Statistics from '../components/Statistics';
import ApplicationDetails from '../components/ApplicationDetails';

// Dummy data for testing the UI
const mockApplications = [
  {
    applicationID: 'APP-8821',
    studentName: 'Zulhelmi Ahmad',
    scholarshipName: "Merit's Scholarship",
    major: 'Computer Science',
    submittedAt: '12/01/2026',
    status: 'APPROVED',
    judgingCompleted: true,
    totalScore: 285
  },
  {
    applicationID: 'APP-9902',
    studentName: 'Sarah Jenkins',
    scholarshipName: "President's Scholarship",
    major: 'Data Science',
    submittedAt: '15/01/2026',
    status: 'PENDING APPROVAL',
    judgingCompleted: true,
    totalScore: 270
  },
  {
    applicationID: 'APP-1023',
    studentName: 'Lim Wei Kang',
    scholarshipName: "High Achiever's Scholarship",
    major: 'Software Engineering',
    submittedAt: '18/01/2026',
    status: 'UNDER REVIEW',
    judgingCompleted: false,
    totalScore: null
  },
  {
    applicationID: 'APP-4451',
    studentName: 'Nurul Izzah',
    scholarshipName: "Merit's Scholarship",
    major: 'Cybersecurity',
    submittedAt: '20/01/2026',
    status: 'REJECTED',
    judgingCompleted: true,
    totalScore: 120
  }
];

export default function ReviewerDashboard() {
  const [view, setView] = useState('dashboard');
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewerInfo, setReviewerInfo] = useState(null);

  const { currentUser } = useAuth();
  const token = currentUser?.token;

  useEffect(() => {
    if (token && currentUser) {
      fetchReviewerProfile();
      if (view === 'dashboard') {
        fetchDashboard();
      }
    }
  }, [view, token, currentUser]);

  const fetchReviewerProfile = async () => {
    try {
      const reviewerId = currentUser?.user?.id || currentUser?.id;
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviewer/dashboard/${reviewerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviewerInfo(data.profile);
      }
    } catch (err) {
      console.error('Failed to load reviewer profile:', err);
    }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const reviewerId = currentUser?.user?.id || currentUser?.id;
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviewer/dashboard/${reviewerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to load dashboard');

      const data = await response.json();
      if (data.applications) setApplications(data.applications);
    } catch (err) {
      setError('Connection failed. Showing offline dummy data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApplication = (app) => {
    setSelectedApplication(app);
    setView('details');
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="space-y-8">
          {/* View Tabs */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full p-2 flex items-center justify-between gap-2">
            <button
              onClick={() => setView('dashboard')}
              className={`flex-1 text-center py-2 px-4 rounded-full font-medium transition-colors ${
                view === 'dashboard'
                  ? 'bg-blue-600 text-white border-2 border-white'
                  : 'bg-white text-blue-600 border-2 border-blue-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setView('statistics')}
              className={`flex-1 text-center py-2 px-4 rounded-full font-medium transition-colors ${
                view === 'statistics'
                  ? 'bg-blue-600 text-white border-2 border-white'
                  : 'bg-white text-blue-600 border-2 border-blue-600'
              }`}
            >
              Statistics
            </button>
          </div>

          {/* Profile Header */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between border border-gray-100">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-100">
                <img src={personPlaceholder} alt="Profile" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase">
                  {currentUser?.user?.name || currentUser?.name || "Reviewer"}
                </h2>
                <p className="text-blue-800 font-semibold text-sm">Reviewer</p>
                <p className="text-gray-500 text-sm mt-1">
                  {currentUser?.user?.email || currentUser?.email}
                </p>
              </div>
            </div>
            <button className="bg-blue-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition shadow-sm">
              Edit Profile
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            {error && (
              <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading...</p>
              </div>
            )}

            {!loading && (
              <>
                {view === 'dashboard' && (
                  <ApplicationsList
                    applications={applications}
                    onSelectApplication={handleSelectApplication}
                  />
                )}

                {view === 'statistics' && (
                  <Statistics
                    token={token}
                    reviewerId={currentUser?.user?.id || currentUser?.id}
                  />
                )}

                {view === 'details' && selectedApplication && (
                  <ApplicationDetails
                    applicationId={selectedApplication.applicationID}
                    onBack={() => setView('dashboard')}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
