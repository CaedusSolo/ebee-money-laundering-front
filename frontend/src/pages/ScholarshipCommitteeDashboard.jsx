import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ApplicationItem from "../components/ApplicationItem";
import ScoreDisplay from "../components/ScoreDisplay";
import EvaluationModal from './EvaluationModal';
import { useAuth } from '../context/AuthContext';

export default function ScholarshipCommitteeDashboard() {
  const { currentUser } = useAuth();
  const { committeeInfo } = useOutletContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppIndex, setCurrentAppIndex] = useState(null);

const fetchApps = async () => {
  try {
    setLoading(true);
    const id = currentUser?.user?.id || currentUser?.id;
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/committee/dashboard/${id}`, {
      headers: { 'Authorization': `Bearer ${currentUser?.token}` }
    });
    const data = await response.json();

    if (response.ok) {
      // Merge the two lists from the backend
      const combined = [
        ...(data.pendingApplications || []),
        ...(data.gradedApplications || [])
      ].map(app => ({
        ...app,
        scores: {
          academic: app.scores?.academic,
          curriculum: app.scores?.curriculum,
          leadership: app.scores?.leadership,
          // Fallback for remarks if needed
          remarks: app.scores?.remarks || ''
        }
      }));
      setApplications(combined);
    }
  } catch (error) {
    console.error("Dashboard fetch failed:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (currentUser) fetchApps();
  }, [currentUser]);

  const handleOpenModal = (index) => {
    setCurrentAppIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAppIndex(null);
  };

  const handleSubmitEvaluation = async (modalData) => {
    const applicationId = applications[currentAppIndex].id;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/committee/evaluate/${applicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(modalData),
      });

      if (response.ok) {
        alert("Evaluation submitted and saved successfully.");
        handleCloseModal();
        fetchApps(); // Refresh the list to show updated scores/status
      } else {
        const errorData = await response.json();
        alert("Failed to save evaluation: " + (errorData.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Evaluation submission error:", err);
      alert("Network error while saving evaluation.");
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">
        {committeeInfo?.assignedScholarship || "Scholarship"} Applications
      </h3>

      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((app, index) => (
            <ApplicationItem key={app.id} title={app.id} status={app.status} date={app.submittedAt}>
              <button onClick={() => handleOpenModal(index)} className="text-gray-400 hover:text-blue-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <ScoreDisplay value={app.scores?.academic} maxValue={20} />
              <ScoreDisplay value={app.scores?.curriculum} maxValue={20} />
              <ScoreDisplay value={app.scores?.leadership} maxValue={20} />
              <ScoreDisplay value={app.totalScore} variant="total" />
            </ApplicationItem>
          ))
        ) : (
          <p className="text-gray-500 text-center py-10">No applications assigned.</p>
        )}
      </div>

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        application={currentAppIndex !== null ? applications[currentAppIndex] : null}
        onSubmit={handleSubmitEvaluation}
      />
    </div>
  );
}
