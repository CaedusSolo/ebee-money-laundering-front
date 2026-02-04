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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Application Details and Reviews */}
        <div className="lg:col-span-3 space-y-6">
          {/* Application Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">
                  {application?.firstName} {application?.lastName}
                </h2>
                <p className="text-blue-100 mt-2">
                  Application ID: <span className="font-mono font-semibold">{application?.applicationID}</span>
                </p>
              </div>
              <div
                className={`px-5 py-2 rounded-full font-semibold text-lg ${
                  application?.status === 'APPROVED' ? 'bg-green-500' :
                  application?.status === 'REJECTED' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}
              >
                {application?.status}
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white rounded-lg shadow p-6">
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

          {/* Committee Reviews Section */}
          {reviewsData?.committeeReviews && reviewsData.committeeReviews.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Committee Evaluations
              </h3>
              
              {reviewsData?.committeeReviews?.map((review) => (
                <div
                  key={review.reviewID}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header with Committee Member Info */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b-2 border-indigo-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">
                          {review.committeeMemberName}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {review.committeeMemberRole}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                        Evaluated: {review.submittedAt}
                      </p>
                    </div>
                  </div>

                  {/* Scores Grid */}
                  <div className="px-6 py-5">
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                          Academic Performance
                        </p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                          {review.academicRubric}
                          <span className="text-lg text-blue-500">/20</span>
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                          Co-curricular Activities
                        </p>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                          {review.cocurricularRubric}
                          <span className="text-lg text-green-500">/20</span>
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                        <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                          Leadership
                        </p>
                        <p className="text-3xl font-bold text-purple-600 mt-2">
                          {review.leadershipRubric}
                          <span className="text-lg text-purple-500">/20</span>
                        </p>
                      </div>
                    </div>

                    {/* Summary Scores */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                        <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                          Raw Score
                        </p>
                        <p className="text-3xl font-bold text-orange-600 mt-2">
                          {review.rawScore}
                          <span className="text-lg text-orange-500">/60</span>
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                        <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                          Normalized Score
                        </p>
                        <p className="text-3xl font-bold text-indigo-600 mt-2">
                          {review.normalizedScore}
                          <span className="text-lg text-indigo-500">/100</span>
                        </p>
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Evaluator Comments
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Decision Panel - Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* Combined Score Summary */}
            {reviewsData?.combinedScore && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg shadow-lg p-6 border-2 border-orange-300">
                <p className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-2">
                  Committee Consensus
                </p>
                <p className="text-4xl font-black text-orange-600 mb-2">
                  {reviewsData?.combinedScore}
                </p>
                <p className="text-sm text-orange-700 font-semibold">
                  Combined Score out of 300
                </p>
                <div className="mt-4 pt-4 border-t-2 border-orange-300">
                  <p className="text-xs text-orange-600">
                    Average: <span className="font-bold text-lg">{(reviewsData?.combinedScore / 3).toFixed(1)}</span>/100
                  </p>
                </div>
              </div>
            )}

            {/* Statistics Card */}
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-xs font-bold text-gray-600 uppercase mb-4">
                Evaluation Stats
              </p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Evaluators</span>
                  <span className="font-bold text-gray-900">{reviewsData?.totalReviews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                    {application?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Decision Buttons */}
            {application?.status !== "APPROVED" && application?.status !== "REJECTED" && (
              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Final Decision
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleDecision("APPROVE")}
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span>✓ Approve Application</span>
                    )}
                  </button>
                  <button
                    onClick={() => handleDecision("REJECT")}
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span>✕ Reject Application</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Decision Status - When Already Decided */}
            {(application?.status === "APPROVED" || application?.status === "REJECTED") && (
              <div className={`rounded-lg shadow-lg p-6 border-t-4 ${
                application?.status === "APPROVED" 
                  ? "bg-green-50 border-green-500" 
                  : "bg-red-50 border-red-500"
              }`}>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Decision Made
                </h3>
                <div className={`px-4 py-3 rounded-lg text-center font-bold text-lg ${
                  application?.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {application?.status === "APPROVED"
                    ? "✓ Application Approved"
                    : "✕ Application Rejected"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
