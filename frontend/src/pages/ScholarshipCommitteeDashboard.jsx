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

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const id = currentUser?.user?.id || currentUser?.id || 1;
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/committee/dashboard/${id}`, {
          headers: { 'Authorization': `Bearer ${currentUser?.token}` }
        });
        const data = await response.json();

        if (response.ok) {
          const combined = [
            ...(data.pendingApplications || []),
            ...(data.gradedApplications || [])
          ].map(app => ({
            ...app,
            scores: {
              academic: app.scores?.find(s => s.category === 'ACADEMIC')?.score,
              curriculum: app.scores?.find(s => s.category === 'CURRICULUM')?.score,
              leadership: app.scores?.find(s => s.category === 'LEADERSHIP')?.score,
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

  const handleSubmitEvaluation = (modalData) => {
    const newApplications = [...applications];
    const appIndex = currentAppIndex;

    const academic = modalData.academic === '' ? null : modalData.academic;
    const curriculum = modalData.curriculum === '' ? null : modalData.curriculum;
    const leadership = modalData.leadership === '' ? null : modalData.leadership;

    newApplications[appIndex].scores = { academic, curriculum, leadership };
    newApplications[appIndex].status = 'GRADED'; // Aligned with Backend Enum

    if (academic !== null && curriculum !== null && leadership !== null) {
      const totalRaw = academic + curriculum + leadership;
      // Normalizing score to 100 based on raw max of 60
      newApplications[appIndex].totalScore = Math.round((totalRaw / 60) * 100);
    }

    setApplications(newApplications);
    handleCloseModal();
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading applications...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-50">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {committeeInfo?.assignedScholarship} Applications
        </h3>
        <div className="hidden md:flex items-center space-x-3 text-sm font-semibold text-gray-400 mr-4">
          <span className="w-16 text-center">Academic</span>
          <span className="w-16 text-center">Co-Curric.</span>
          <span className="w-16 text-center">Leadership</span>
          <span className="w-16 text-center">Total</span>
        </div>
      </div>

      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((app, index) => (
            <ApplicationItem
              key={app.id}
              title={app.id}
              status={app.status}
              date={app.submittedAt} // 3. KEY MATCH: Use submittedAt from Backend DTO
            >
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
          <p className="text-gray-500 text-center py-10">No applications assigned yet.</p>
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
