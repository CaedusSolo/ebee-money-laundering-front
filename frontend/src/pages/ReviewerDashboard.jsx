import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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
  // Initialize with mock data for testing
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { currentUser } = useAuth();
  const token = currentUser?.token;

  useEffect(() => {
    if (view === 'dashboard' && token && currentUser) {
      fetchDashboard();
    }
  }, [view, token, currentUser]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const reviewerId = currentUser?.userID || currentUser?.id;
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
      // Only update if data is returned from API, otherwise keep mock data
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Reviewer Dashboard</h1>
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setView('statistics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'statistics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Statistics
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
                reviewerId={currentUser?.userID || currentUser?.id}
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
      </main>
    </div>
  );
}
