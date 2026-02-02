import React, { useState } from 'react';
import ApplicationItem from './ApplicationItem';
import ScoreDisplay from './ScoreDisplay';

export default function ApplicationsList({ applications, onSelectApplication }) {
  const [selectedStatus, setSelectedStatus] = useState(null);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING APPROVAL': return 'Pending Approval';
      case 'UNDER REVIEW': return 'Under Review';
      case 'APPROVED': return 'Approved';
      case 'REJECTED': return 'Rejected';
      default: return status;
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
            All
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStatus === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <div className="p-4 bg-gray-100 rounded text-gray-600">No applications found.</div>
        ) : (
          filteredApplications.map((app) => (
            <ApplicationItem
              key={app.applicationID}
              title={app.studentName}
              status={getStatusLabel(app.status)}
              date={app.submittedAt}
            >
              {app.judgingCompleted && (
                <ScoreDisplay
                  value={app.totalScore}
                  maxValue={300}
                  variant="reviewerTotal"
                  className="w-24 h-14"
                />
              )}
              {app.judgingCompleted && (
                <button
                  onClick={() => onSelectApplication(app)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              )}
            </ApplicationItem>
          ))
        )}
      </div>
    </div>
  );
}
