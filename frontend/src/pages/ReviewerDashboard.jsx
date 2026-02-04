import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import personPlaceholder from '../assets/personPlaceholder.svg';
import ApplicationsList from '../components/ApplicationsList';
import Statistics from '../components/Statistics';
import ApplicationDetails from '../components/ApplicationDetails';

export default function ReviewerDashboard() {
  const [view, setView] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewerInfo, setReviewerInfo] = useState(null);

  const { currentUser } = useAuth();
  const token = currentUser?.token;

  useEffect(() => {
    if (token && currentUser) {
      fetchReviewerData();
    }
  }, [token, currentUser]);

  useEffect(() => {
    if (view === 'dashboard' && token && currentUser) {
      fetchApplications();
    }
  }, [view, token, currentUser]);

  const fetchReviewerData = async () => {
    try {
      const reviewerId = currentUser?.reviewerId || currentUser?.user?.id || currentUser?.id;
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviewer/${reviewerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviewerInfo(data);
      }
    } catch (err) {
      console.error('Failed to load reviewer info:', err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const reviewerId = currentUser?.reviewerId || currentUser?.user?.id || currentUser?.id;
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviewer/dashboard/${reviewerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load applications');
      }

      const data = await response.json();
      if (data.applications && Array.isArray(data.applications)) {
        setApplications(data.applications);
      }
    } catch (err) {
      setError(err.message || 'Failed to load applications');
      console.error('Error fetching applications:', err);
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
                  {reviewerInfo?.name || currentUser?.user?.name || currentUser?.name || "Reviewer"}
                </h2>
                <p className="text-blue-800 font-semibold text-sm">Scholarship Reviewer</p>
                <p className="text-gray-500 text-sm mt-1">
                  {reviewerInfo?.email || currentUser?.user?.email || currentUser?.email}
                </p>
                {reviewerInfo?.assignedScholarshipId && (
                  <p className="text-gray-500 text-sm mt-1">
                    Assigned Scholarship ID: {reviewerInfo.assignedScholarshipId}
                  </p>
                )}
              </div>
            </div>
            <button className="bg-blue-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition shadow-sm">
              Edit Profile
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {loading && view === 'dashboard' && (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading assigned applications...</p>
              </div>
            )}

            {!loading && (
              <>
                {view === 'dashboard' && (
                  <>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Assigned Applications ({applications.length})
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Applications for the scholarship you are assigned to review
                      </p>
                    </div>
                    <ApplicationsList
                      applications={applications}
                      onSelectApplication={handleSelectApplication}
                    />
                  </>
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
