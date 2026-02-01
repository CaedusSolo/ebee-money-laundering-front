import React, { useState } from 'react';

export default function ApplicationsList({ applications, onSelectApplication }) {
  const [selectedStatus, setSelectedStatus] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING APPROVAL':
        return 'bg-yellow-200 text-yellow-800';
      case 'UNDER REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING APPROVAL':
        return 'Pending Approval';
      case 'UNDER REVIEW':
        return 'Under Review';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  };

  // Get unique statuses from applications
  const statuses = [...new Set(applications.map(app => app.status))];

  // Filter applications based on selected status
  const filteredApplications = selectedStatus
    ? applications.filter(app => app.status === selectedStatus)
    : applications;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Assigned Applications</h2>
        <p className="text-gray-600 mb-4">Total: {filteredApplications.length}</p>

        {/* Status Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStatus(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <div className="p-4 bg-gray-100 rounded text-gray-600">
            No applications found with this status.
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.applicationID}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{app.studentName}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Scholarship:</span> {app.scholarshipName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Major:</span> {app.major}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Submitted:</span> {app.submittedAt}
                  </p>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end gap-3">
                  {app.judgingCompleted && (
                    <div className="px-4 py-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <p className="text-xs text-gray-600 font-medium mb-1">Total Score</p>
                      <p className="text-2xl font-bold text-green-600">{app.totalScore}<span className="text-sm text-gray-600 font-medium">/300</span></p>
                    </div>
                  )}
                  {app.judgingCompleted && (
                    <button
                      onClick={() => onSelectApplication(app)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
