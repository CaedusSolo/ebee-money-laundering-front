import React, { useState, useEffect } from 'react';
import ApplicationItem from "../components/ApplicationItem";
import ScoreDisplay from "../components/ScoreDisplay";
import EvaluationModal from './EvaluationModal';
import { useAuth } from '../context/AuthContext';

export default function ScholarshipCommitteeDashboard() {
  const { currentUser } = useAuth();
  const [scholarshipGroups, setScholarshipGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const id = currentUser?.user?.id || currentUser?.id;
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/committee/dashboard/${id}`, {
        headers: { 'Authorization': `Bearer ${currentUser?.token}` }
      });
      const data = await response.json();

      if (response.ok) {
        // We still receive both from the backend, but we will only use groups that have pending apps
        setScholarshipGroups(data.scholarships || {});
      }
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchDashboard();
  }, [currentUser]);

  const handleOpenModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
  };

  const handleSubmitEvaluation = async (modalData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/committee/evaluate/${selectedApp.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(modalData),
      });

      if (response.ok) {
        handleCloseModal();
        fetchDashboard();
      } else {
        const err = await response.json();
        alert(err.error || "Failed to save evaluation.");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400 animate-pulse">Loading assigned applications...</div>;

  // Filter scholarships to only those that have at least one pending application
  const activeScholarships = Object.entries(scholarshipGroups).filter(
    ([_, groups]) => groups.pending?.length > 0
  );

  return (
    <div className="space-y-10">
      {activeScholarships.length > 0 ? (
        activeScholarships.map(([scholarshipName, groups]) => (
          <div key={scholarshipName} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-gray-800 tracking-tight">{scholarshipName}</h3>
              </div>
              <div className="hidden md:flex space-x-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-4">
                <span className="w-16 text-center">Score</span>
                <span className="w-16 text-center">Status</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Evaluation ({groups.pending.length})</h4>
              </div>
              <div className="space-y-3">
                {groups.pending.map((app) => (
                  <ApplicationItem key={app.id} title={app.studentName} status="PENDING" date={app.submittedAt}>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => handleOpenModal(app)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-all text-[10px] uppercase"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Evaluate</span>
                        </button>
                    </div>
                  </ApplicationItem>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-20 rounded-3xl shadow-sm border text-center">
          <div className="flex justify-center mb-4 text-emerald-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Queue Empty</p>
          <p className="text-gray-500 font-black text-xl">All evaluations are completed.</p>
        </div>
      )}

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        application={selectedApp}
        onSubmit={handleSubmitEvaluation}
      />
    </div>
  );
}
