import { useEffect, useState } from "react";

import ApplicationCard from "../components/ApplicationCard";
import ApplicationService from "../services/ApplicationService";
import ScholarshipService from "../services/ScholarshipService";
import { useAuth } from "../context/AuthContext";

import File from "../assets/file-text.svg";

export default function ManageApplications() {
  const { currentUser } = useAuth();
  const applicationService = new ApplicationService(currentUser.token);
  const scholarshipService = new ScholarshipService(currentUser.token);

  const [applicationData, setApplicationData] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const data = await scholarshipService.getScholarships();
        setScholarships(data);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      }
    };

    fetchScholarships();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedScholarship) {
        setApplicationData([]);
        return;
      }

      setLoading(true);
      try {
        const data =
          await applicationService.getApplicationSummariesByScholarship(
            selectedScholarship,
          );
        console.log(data);
        setApplicationData(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [selectedScholarship]);

  const handleDeleteApplication = async (applicationId) => {
    try {
      await applicationService.deleteApplication(applicationId);
      setApplicationData((prev) =>
        prev.filter((app) => app.applicationId !== applicationId),
      );
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application: " + error.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src={File} alt="List" className="w-6 h-6" />
          <h1 className="text-xl font-bold text-foreground">
            List of Applications
          </h1>
        </div>

        {/* Scholarship Dropdown */}
        <select
          value={selectedScholarship}
          onChange={(e) => setSelectedScholarship(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a Scholarship</option>
          {scholarships.map((scholarship) => (
            <option key={scholarship.id} value={scholarship.id}>
              {scholarship.name}
            </option>
          ))}
        </select>
      </div>

      {/* Application List */}
      <div className="flex flex-col gap-4">
        {!selectedScholarship ? (
          <p className="text-gray-500">
            Please select a scholarship to view applications.
          </p>
        ) : loading ? (
          <p className="text-gray-500">Loading applications...</p>
        ) : applicationData.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          applicationData.map((application) => (
            <ApplicationCard
              user={{
                applicationID: application.applicationId,
                name: application.studentName,
                createdAt: application.createdAt,
                submittedAt: application.submittedAt,
                status: application.status,
              }}
              key={application.applicationId}
              onDelete={handleDeleteApplication}
            />
          ))
        )}
      </div>
    </div>
  );
}
