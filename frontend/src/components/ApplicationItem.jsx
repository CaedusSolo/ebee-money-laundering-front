import React from 'react';

const ApplicationItem = ({ title, status, date, children, className = "" }) => {
  return (
    <div className={`bg-gray-50 p-4 rounded-lg border border-gray-200 border-l-6 border-l-blue-600 flex flex-col md:flex-row items-start md:items-center justify-between transition-all hover:shadow-sm ${className}`}>
      {/* Shared Info Section */}
      <div className="flex-1 mb-4 md:mb-0 pl-3">
        <h4 className="font-bold text-lg text-gray-900">{title}</h4>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1">
          <p className="text-sm text-gray-600">
            Status: <span className="font-medium">{status}</span>
          </p>
          <p className="text-sm text-gray-400">Submitted: {date}</p>
        </div>
      </div>

      {/* Action/Score Section (Role-Specific Content) */}
      <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
        {children}
      </div>
    </div>
  );
};

export default ApplicationItem;
