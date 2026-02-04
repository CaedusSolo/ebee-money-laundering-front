import React, { useState, useEffect } from 'react';

// 1. Accept token and reviewerId as props
export default function Statistics({ token, reviewerId }) {
  const DUMMY_STATS = {
    totalApplications: 120,
    approvalRate: 45,
    approvedApplications: 54,
    rejectedApplications: 40,
    pendingApplications: 26,
    applicationsByStatus: {
      'APPROVED': 54,
      'REJECTED': 40,
      'PENDING_REVIEW': 26
    }
  };

  const [stats, setStats] = useState(DUMMY_STATS); // Initialize with dummy data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 2. Only fetch if token and reviewerId are available
    if (token && reviewerId) {
      fetchStatistics();
    }
  }, [token, reviewerId]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Fetch from the correct endpoint without reviewerId
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviewer/statistics`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Unauthorized or Server Error');

      const data = await response.json();
      // Transform the data to match the frontend expectations
      const transformedData = {
        totalApplications: data.totalApplications,
        approvalRate: Math.round(data.approvalRate),
        approvedApplications: data.approvedApplications,
        rejectedApplications: data.rejectedApplications,
        pendingApplications: data.gradedApplications,
        applicationsByStatus: {
          'APPROVED': data.approvedApplications,
          'REJECTED': data.rejectedApplications,
          'PENDING_APPROVAL': data.gradedApplications
        }
      };
      setStats(transformedData);
    } catch (err) {
      setError('Using offline statistics data.');
      setStats(DUMMY_STATS); // Fallback to dummy data
      console.error('Statistics Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to safely calculate percentage and avoid Division by Zero
  const calculatePercent = (value, total) => {
    if (!total || total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mr-3"></div>
        <p className="text-gray-500 font-medium">Loading award analytics...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Scholarship Awards Statistics</h2>

      {error && (
        <div className="mb-6 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Applications</p>
          <p className="text-4xl font-black text-blue-700 mt-2">{stats?.totalApplications}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Approval Rate</p>
          <p className="text-4xl font-black text-green-600 mt-2">{stats?.approvalRate}%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Approved</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.approvedApplications}</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            {calculatePercent(stats?.approvedApplications, stats?.totalApplications)}% of total
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Rejected</p>
          <p className="text-3xl font-bold text-red-500 mt-2">{stats?.rejectedApplications}</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            {calculatePercent(stats?.rejectedApplications, stats?.totalApplications)}% of total
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-500 mt-2">{stats?.pendingApplications}</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            {calculatePercent(stats?.pendingApplications, stats?.totalApplications)}% of total
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
          Applications by Status
        </h3>
        <div className="space-y-6">
          {stats?.applicationsByStatus && Object.entries(stats.applicationsByStatus).map(([status, count]) => (
            <div key={status}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-gray-700">{status.replace('_', ' ')}</p>
                <p className="text-sm font-bold text-gray-500">{count} <span className="font-normal">applications</span></p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    status === 'APPROVED'
                      ? 'bg-green-500'
                      : status === 'REJECTED'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                  style={{
                    width: `${calculatePercent(count, stats.totalApplications)}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
