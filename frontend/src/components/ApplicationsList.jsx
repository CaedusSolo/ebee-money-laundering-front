import React, { useState, useEffect } from 'react';
import ApplicationItem from './ApplicationItem';
import ScoreDisplay from './ScoreDisplay';
import { useAuth } from '../context/AuthContext';

export default function ApplicationsList({ applications, onSelectApplication }) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [scores, setScores] = useState({});
  const [loadingScores, setLoadingScores] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch committee scores for applications pending approval
    const pendingApps = applications.filter(app => app.status === 'PENDING_APPROVAL');
    if (pendingApps.length > 0 && currentUser?.token) {
      fetchCommitteeScores(pendingApps);
    }
  }, [applications, currentUser?.token]);

  const fetchCommitteeScores = async (gradedApps) => {
    setLoadingScores(true);
    try {
      const scoreMap = {};
      for (const app of gradedApps) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/reviewer/applications/${app.applicationID}/grades`,
            {
              headers: { 'Authorization': `Bearer ${currentUser?.token}` }
            }
          );
          if (response.ok) {
            const data = await response.json();
            scoreMap[app.applicationID] = data.combinedScore || 0;
          }
        } catch (err) {
          console.error(`Failed to fetch score for app ${app.applicationID}:`, err);
        }
      }
      setScores(scoreMap);
    } finally {
      setLoadingScores(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING_APPROVAL': return 'Pending Approval';
      case 'UNDER_REVIEW': return 'Under Review';
      case 'GRADED': return 'Graded';
      case 'APPROVED': return 'Approved';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'GRADED': return 'bg-green-50 border-l-4 border-green-500';
      case 'APPROVED': return 'bg-green-50 border-l-4 border-green-500';
      case 'REJECTED': return 'bg-red-50 border-l-4 border-red-500';
      case 'UNDER_REVIEW': return 'bg-blue-50 border-l-4 border-blue-500';
      case 'PENDING_APPROVAL': return 'bg-yellow-50 border-l-4 border-yellow-500';
      default: return 'bg-gray-50 border-l-4 border-gray-300';
    }
  };

  const statuses = [...new Set(applications.map(app => app.status))];
  const filteredApplications = selectedStatus
    ? applications.filter(app => app.status === selectedStatus)
    : applications;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Assigned Applications</h2>
        <p className="text-gray-600 mb-4">Total: {filteredApplications.length}</p>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStatus(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStatus === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
          >
            All ({applications.length})
          </button>
          {statuses.map((status) => {
            const count = applications.filter(app => app.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStatus === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
              >
                {getStatusLabel(status)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <div className="p-4 bg-gray-100 rounded text-gray-600">No applications found.</div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.applicationID}
              className={`p-4 rounded-lg ${getStatusColor(app.status)} hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {app.studentName}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-600">
                      Application ID: <span className="font-mono font-bold">{app.applicationID}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'GRADED' ? 'bg-green-200 text-green-800' :
                      app.status === 'APPROVED' ? 'bg-green-200 text-green-800' :
                      app.status === 'REJECTED' ? 'bg-red-200 text-red-800' :
                      app.status === 'UNDER_REVIEW' ? 'bg-blue-200 text-blue-800' :
                      app.status === 'PENDING_APPROVAL' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {getStatusLabel(app.status)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {app.status === 'PENDING_APPROVAL' && (
                    <div className="text-right pr-2">
                      <p className="text-xs text-gray-600 font-medium">COMMITTEE SCORE</p>
                      <p className="text-2xl font-bold text-green-600">
                        {scores[app.applicationID] !== undefined ? scores[app.applicationID] : '—'}
                      </p>
                      <p className="text-xs text-green-700">/300</p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => onSelectApplication(app)}
                    className={`px-4 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${
                      app.status === 'PENDING_APPROVAL'
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                        : app.status === 'APPROVED'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : app.status === 'REJECTED'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {app.status === 'PENDING_APPROVAL' ? 'Review' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
