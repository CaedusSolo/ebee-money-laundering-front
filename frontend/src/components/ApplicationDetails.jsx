import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ApplicationService from "../services/ApplicationService";

export default function ApplicationDetails({ applicationId, onBack }) {
  const [application, setApplication] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const userRole = currentUser?.role;

  useEffect(() => {
    if (applicationId && currentUser?.token) {
      setApplication(null);
      setReviewsData(null);
      setError("");
      fetchApplicationDetails();
    }
  }, [applicationId, currentUser?.token]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    try {
      const applicationService = new ApplicationService(currentUser.token);
      const [appData, reviews] = await Promise.all([
        applicationService.getApplicationDetailsById(applicationId),
        applicationService.getReviewerApplicationGrades(applicationId),
      ]);
      setApplication(appData);
      console.log(appData.address);
      setReviewsData(reviews);
    } catch (err) {
      setError(`Failed to load application details: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (approvalDecision) => {
    setSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviewer/applications/${applicationId}/decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser?.token}`,
          },
          body: JSON.stringify({ decision: approvalDecision }),
        },
      );

      if (response.ok) {
        alert(`Application ${approvalDecision.toLowerCase()}d successfully`);
        onBack();
      } else {
        setError("Failed to submit decision");
      }
    } catch (err) {
      setError("Error submitting decision");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Loading application details...</div>
    );
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
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back to Dashboard
      </button>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Application Details and Reviews */}
        <div className="col-span-2">
          {/* Application Details */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {application?.firstName} {application?.lastName}
              </h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">Reviewer</p>
                <p className="font-medium text-gray-900">
                  {application?.reviewerName || "Not assigned"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">
                      {application?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {application?.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NRIC</p>
                    <p className="font-medium text-gray-900">
                      {application?.nricNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium text-gray-900">
                      {application?.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nationality</p>
                    <p className="font-medium text-gray-900">
                      {application?.nationality}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium text-gray-900">
                      {application?.dateOfBirth}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Education
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Institution</p>
                    <p className="font-medium text-gray-900">
                      {application?.education?.college}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Major</p>
                    <p className="font-medium text-gray-900">
                      {application?.education?.major}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Year</p>
                    <p className="font-medium text-gray-900">
                      Year {application?.education?.currentYearOfStudy}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected Graduation</p>
                    <p className="font-medium text-gray-900">
                      {application?.education?.expectedGraduationYear}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Study Level</p>
                    <p className="font-medium text-gray-900">
                      {application?.education?.studyLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Financial Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Monthly Family Income</p>
                  <p className="font-medium text-gray-900">
                    RM {application?.monthlyFamilyIncome?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bumiputera Status</p>
                  <p className="font-medium text-gray-900">
                    {application?.isBumiputera ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Address
              </h3>
              <div className="space-y-3">
                <p className="font-medium text-gray-900">
                  {application?.address?.homeAddress}
                </p>
                <p className="text-gray-600">
                  {application?.address?.city}, {application?.address?.zipCode},{" "}
                  {application?.address?.state}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Extracurricular Activities
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left text-sm font-semibold text-gray-700 px-4 py-3 border-b">
                      Activity Name
                    </th>
                    <th className="text-left text-sm font-semibold text-gray-700 px-4 py-3 border-b">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {application?.extracurriculars?.length > 0 ? (
                    application.extracurriculars.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="text-sm text-gray-900 px-4 py-3 border-b">
                          {activity.activityName}
                        </td>
                        <td className="text-sm text-gray-900 px-4 py-3 border-b">
                          {activity.role}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="text-sm text-gray-500 px-4 py-3 text-center"
                      >
                        No extracurricular activities listed
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Documents
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <a
                  href={application?.nricDoc?.fileUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="text-blue-600">📄</span>
                  <span className="text-sm font-medium text-blue-700">
                    NRIC Document
                  </span>
                </a>
                <a
                  href={application?.transcriptDoc?.fileUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span className="text-green-600">📄</span>
                  <span className="text-sm font-medium text-green-700">
                    Transcript Document
                  </span>
                </a>
                <a
                  href={
                    application?.familyIncomeConfirmationDoc?.fileUrl || "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="text-purple-600">📄</span>
                  <span className="text-sm font-medium text-purple-700">
                    Family Income Document
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Committee Reviews */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Committee Member Reviews
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Total Reviews: {reviewsData?.totalReviews}
            </p>

            <div className="space-y-6">
              {reviewsData?.committeeReviews?.map((review, index) => (
                <div
                  key={review.reviewID}
                  className="border-l-4 border-blue-500 pl-4 pb-6"
                >
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900">
                      {review.committeeMemberName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {review.committeeMemberRole}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {review.submittedAt}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-blue-50 rounded">
                      <p className="text-xs text-gray-600 font-medium">
                        Academic
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        {review.academicRubric}/20
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <p className="text-xs text-gray-600 font-medium">
                        Co-curricular
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {review.cocurricularRubric}/20
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <p className="text-xs text-gray-600 font-medium">
                        Leadership
                      </p>
                      <p className="text-lg font-bold text-purple-600">
                        {review.leadershipRubric}/20
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-orange-50 rounded">
                      <p className="text-xs text-gray-600 font-medium">
                        Raw Score
                      </p>
                      <p className="text-lg font-bold text-orange-600">
                        {review.rawScore}/60
                      </p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded">
                      <p className="text-xs text-gray-600 font-medium">
                        Normalized Score
                      </p>
                      <p className="text-lg font-bold text-indigo-600">
                        {review.normalizedScore}/100
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-900">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decision Panel */}
        <div>
          {/* Combined Score */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Summary
            </h3>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">
                Combined Committee Score
              </p>
              <p className="text-3xl font-bold text-orange-600">
                {reviewsData?.combinedScore}/300
              </p>
            </div>
            <p className="text-xs text-gray-600">
              Combined normalized scores from {reviewsData?.totalReviews} judges
            </p>
          </div>

          {/* Decision Buttons */}
          {userRole === "REVIEWER" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Make Final Decision
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleDecision("APPROVE")}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  {submitting ? "Processing..." : "✓ Approve"}
                </button>
                <button
                  onClick={() => handleDecision("REJECT")}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  {submitting ? "Processing..." : "✕ Reject"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
