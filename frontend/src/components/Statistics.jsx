import React, { useState, useEffect } from 'react';

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviewer/statistics`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading statistics...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Scholarship Awards Statistics</h2>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Total Applications</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats?.totalApplications}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Approval Rate</p>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats?.approvalRate}%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Approved</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.approvedApplications}</p>
          <p className="text-xs text-gray-500 mt-2">
            {((stats?.approvedApplications / stats?.totalApplications) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Rejected</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats?.rejectedApplications}</p>
          <p className="text-xs text-gray-500 mt-2">
            {((stats?.rejectedApplications / stats?.totalApplications) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats?.pendingApplications}</p>
          <p className="text-xs text-gray-500 mt-2">
            {((stats?.pendingApplications / stats?.totalApplications) * 100).toFixed(1)}% of total
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Applications by Status</h3>
        <div className="space-y-4">
          {stats?.applicationsByStatus && Object.entries(stats.applicationsByStatus).map(([status, count]) => (
            <div key={status}>
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-gray-900">{status}</p>
                <p className="text-gray-600">{count} applications</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    status === 'APPROVED'
                      ? 'bg-green-600'
                      : status === 'REJECTED'
                      ? 'bg-red-600'
                      : 'bg-yellow-600'
                  }`}
                  style={{
                    width: `${(count / stats.totalApplications) * 100}%`
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
