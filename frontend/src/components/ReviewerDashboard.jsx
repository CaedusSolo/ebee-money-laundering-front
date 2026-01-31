import React, { useState, useEffect } from 'react';
import ApplicationsList from './ApplicationsList';
import Statistics from './Statistics';
import ApplicationDetails from './ApplicationDetails';

export default function ReviewerDashboard() {
  const [view, setView] = useState('dashboard'); // dashboard, applications, statistics, details
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reviewerId = 1; // This should come from auth context

  useEffect(() => {
    if (view === 'dashboard') {
      fetchDashboard();
    }
  }, [view]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/reviewer/dashboard/${reviewerId}`);
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (err) {
      setError('Failed to load dashboard');
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
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
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
              <ApplicationsList applications={applications} onSelectApplication={handleSelectApplication} />
            )}

            {view === 'statistics' && <Statistics />}

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
