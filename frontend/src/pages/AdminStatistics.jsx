import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ApplicationService from "../services/ApplicationService";
import ScholarshipService from "../services/ScholarshipService";

export default function AdminStatistics() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    totalScholarships: 0,
    applicationsByStatus: {},
    applicationsByScholarship: [],
    recentApplications: [],
    avgCgpa: 0,
    avgIncome: 0,
  });

  useEffect(() => {
    if (currentUser?.token) {
      fetchStatistics();
    }
  }, [currentUser?.token]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const applicationService = new ApplicationService(currentUser.token);
      const scholarshipService = new ScholarshipService(currentUser.token);

      const [applications, scholarships] = await Promise.all([
        applicationService.getApplications(),
        scholarshipService.getScholarships(),
      ]);

      // Calculate statistics
      const statusCounts = {};
      let totalCgpa = 0;
      let cgpaCount = 0;
      let totalIncome = 0;
      let incomeCount = 0;

      applications.forEach((app) => {
        // Count by status
        const status = app.status || "UNKNOWN";
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        // Sum CGPA
        if (app.cgpa) {
          totalCgpa += app.cgpa;
          cgpaCount++;
        }

        // Sum income
        if (app.monthlyFamilyIncome) {
          totalIncome += app.monthlyFamilyIncome;
          incomeCount++;
        }
      });

      // Applications per scholarship
      const scholarshipCounts = {};
      applications.forEach((app) => {
        const schId = app.scholarshipID;
        scholarshipCounts[schId] = (scholarshipCounts[schId] || 0) + 1;
      });

      const applicationsByScholarship = scholarships.map((sch) => ({
        id: sch.id,
        name: sch.name,
        count: scholarshipCounts[sch.id] || 0,
      }));

      // Recent applications (last 5)
      const recentApplications = [...applications]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalApplications: applications.length,
        totalScholarships: scholarships.length,
        applicationsByStatus: statusCounts,
        applicationsByScholarship,
        recentApplications,
        avgCgpa: cgpaCount > 0 ? (totalCgpa / cgpaCount).toFixed(2) : 0,
        avgIncome: incomeCount > 0 ? Math.round(totalIncome / incomeCount) : 0,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: "bg-gray-100 text-gray-800",
      SUBMITTED: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
      GRADED: "bg-purple-100 text-purple-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Statistics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Total Applications
              </p>
              <p className="text-3xl font-bold mt-1">
                {stats.totalApplications}
              </p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                Total Scholarships
              </p>
              <p className="text-3xl font-bold mt-1">
                {stats.totalScholarships}
              </p>
            </div>
            <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Average CGPA
              </p>
              <p className="text-3xl font-bold mt-1">{stats.avgCgpa}</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">
                Avg. Family Income
              </p>
              <p className="text-3xl font-bold mt-1">
                RM {stats.avgIncome.toLocaleString()}
              </p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 rounded-full p-3">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown & Scholarship Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Applications by Status
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.applicationsByStatus).map(
              ([status, count]) => {
                const percentage =
                  stats.totalApplications > 0
                    ? Math.round((count / stats.totalApplications) * 100)
                    : 0;
                return (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
                      >
                        {status.replace("_", " ")}
                      </span>
                      <span className="text-gray-600">
                        {count} applications
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-10 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              },
            )}
            {Object.keys(stats.applicationsByStatus).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No applications yet
              </p>
            )}
          </div>
        </div>

        {/* Applications by Scholarship */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Applications by Scholarship
          </h2>
          <div className="space-y-3">
            {stats.applicationsByScholarship.map((sch) => {
              const maxCount = Math.max(
                ...stats.applicationsByScholarship.map((s) => s.count),
                1,
              );
              const percentage = Math.round((sch.count / maxCount) * 100);
              return (
                <div key={sch.id} className="flex items-center justify-between">
                  <span className="text-gray-700 truncate flex-1 mr-4">
                    {sch.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-8 text-right">
                      {sch.count}
                    </span>
                  </div>
                </div>
              );
            })}
            {stats.applicationsByScholarship.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No scholarships yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Applications
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Applicant
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  CGPA
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recentApplications.map((app) => (
                <tr
                  key={app.applicationID}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-800">
                      {app.firstName} {app.lastName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {app.cgpa ? app.cgpa.toFixed(2) : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}
                    >
                      {app.status?.replace("_", " ") || "Unknown"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
              {stats.recentApplications.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No recent applications
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
