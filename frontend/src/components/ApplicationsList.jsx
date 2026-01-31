import React from 'react';

export default function ApplicationsList({ applications, onSelectApplication }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Assigned Applications</h2>
        <p className="text-gray-600">Total: {applications.length}</p>
      </div>

      <div className="grid gap-4">
        {applications.length === 0 ? (
          <div className="p-4 bg-gray-100 rounded text-gray-600">
            No applications assigned yet.
          </div>
        ) : (
          applications.map((app) => (
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
                  {app.judgingCompleted && (
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      <span className="font-medium">Total Score:</span> {app.totalScore}/300
                    </p>
                  )}
                </div>
                <div className="ml-4 flex flex-col items-end gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                    {app.status === 'PENDING_APPROVAL' ? 'Pending Approval' : 'Under Review'}
                  </span>
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
