import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ApplicationDetails({ applicationId, onBack }) {
  const [application, setApplication] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (applicationId && currentUser?.token) {
      // Clear previous data when applicationId changes
      setApplication(null);
      setReviewsData(null);
      setError("");
      setSuccessMessage("");
      fetchApplicationDetails();
    }
  }, [applicationId, currentUser?.token]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    console.log("Fetching application details for ID:", applicationId); // DEBUG
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.token}`,
      };

      const url = `${import.meta.env.VITE_API_BASE_URL}/api/reviewer/applications/${applicationId}`;
      console.log("Requesting URL:", url); // DEBUG

      const [appRes, reviewsRes] = await Promise.all([
        fetch(url, { headers }),
        fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/reviewer/applications/${applicationId}/grades`,
          { headers },
        ),
      ]);

      if (!appRes.ok) {
        throw new Error(`Failed to fetch application: ${appRes.statusText}`);
      }

      const appData = await appRes.json();
      console.log("Received application data:", appData); // DEBUG
      const reviewsData = reviewsRes.ok ? await reviewsRes.json() : null;

      setApplication(appData);
      setReviewsData(reviewsData);
    } catch (err) {
      setError(`Failed to load application details: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (approvalDecision) => {
    setSubmitting(true);
    setError("");
    setSuccessMessage("");
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
        const result = await response.json();
        setSuccessMessage(`Application ${approvalDecision.toLowerCase()}d successfully`);
        // Refresh the application details
        setTimeout(() => {
          fetchApplicationDetails();
        }, 1000);
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

  const getStatusColor = (status) => {
    if (!status) return "gray";
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "green";
      case "REJECTED":
        return "red";
      case "PENDING_APPROVAL":
      case "PENDING APPROVAL":
        return "yellow";
      case "UNDER REVIEW":
        return "blue";
      default:
        return "gray";
    }
  };

  const getStatusBgClass = (status) => {
    const color = getStatusColor(status);
    const bgClasses = {
      green: "bg-green-100",
      red: "bg-red-100",
      yellow: "bg-yellow-100",
      blue: "bg-blue-100",
      gray: "bg-gray-100",
    };
    return bgClasses[color] || "bg-gray-100";
  };

  const getStatusTextClass = (status) => {
    const color = getStatusColor(status);
    const textClasses = {
      green: "text-green-800",
      red: "text-red-800",
      yellow: "text-yellow-800",
      blue: "text-blue-800",
      gray: "text-gray-800",
    };
    return textClasses[color] || "text-gray-800";
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-xl font-semibold text-gray-700">
          Loading application details...
        </div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div>
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Dashboard
        </button>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
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

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded mb-6">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main Application Details and Reviews */}
        <div className="col-span-2">
          {/* Application Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {application?.firstName} {application?.lastName}
                </h2>
                <p className="text-gray-600 mt-1">
                  Application ID: {application?.applicationID}
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-full font-medium ${getStatusBgClass(
                  application?.status
                )} ${getStatusTextClass(application?.status)}`}
              >
                {application?.status}
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="space-y-3">
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
                Application Dates
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Submitted Date</p>
                  <p className="font-medium text-gray-900">
                    {application?.submittedAt}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created Date</p>
                  <p className="font-medium text-gray-900">
                    {application?.createdAt}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Committee Reviews */}
          {reviewsData?.committeeReviews && reviewsData.committeeReviews.length > 0 && (
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
          )}
        </div>

        {/* Decision Panel */}
        <div>
          {/* Combined Score */}
          {reviewsData?.combinedScore && (
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
          )}

          {/* Decision Buttons */}
          {application?.status !== "APPROVED" && application?.status !== "REJECTED" && (
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
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

          {(application?.status === "APPROVED" || application?.status === "REJECTED") && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Decision Status
              </h3>
              <div
                className={`px-4 py-3 rounded-lg text-center font-medium ${getStatusBgClass(
                  application?.status
                )} ${getStatusTextClass(application?.status)}`}
              >
                {application?.status === "APPROVED"
                  ? "✓ Application Approved"
                  : "✕ Application Rejected"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
