import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
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

  return (
    <div className="space-y-10">
      {Object.entries(scholarshipGroups).length > 0 ? (
        Object.entries(scholarshipGroups).map(([scholarshipName, groups]) => (
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
                <span className="w-16 text-center">Academic</span>
                <span className="w-16 text-center">Curriculum</span>
                <span className="w-16 text-center">Leadership</span>
                <span className="w-16 text-center">Total</span>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Evaluation ({groups.pending?.length || 0})</h4>
              </div>
              <div className="space-y-3">
                {groups.pending?.length > 0 ? (
                  groups.pending.map((app) => (
                    <ApplicationItem key={app.id} title={app.id} status="PENDING" date={app.submittedAt}>
                      <button
                        onClick={() => handleOpenModal(app)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <ScoreDisplay value={null} maxValue={20} />
                      <ScoreDisplay value={null} maxValue={20} />
                      <ScoreDisplay value={null} maxValue={20} />
                      <ScoreDisplay value={0} variant="total" maxValue={60} />
                    </ApplicationItem>
                  ))
                ) : (
                  <div className="py-8 text-center border-2 border-dashed border-gray-50 rounded-xl">
                    <p className="text-sm text-gray-400 font-medium italic">No pending evaluations.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed ({groups.graded?.length || 0})</h4>
              </div>
              <div className="space-y-3">
                {groups.graded?.length > 0 ? (
                  groups.graded.map((app) => (
                    <ApplicationItem key={app.id} title={app.id} status="GRADED" date={app.submittedAt}>
                      <button
                        onClick={() => handleOpenModal(app)}
                        className="p-2 text-emerald-600 bg-emerald-50 rounded-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <ScoreDisplay value={app.scores?.academic} maxValue={20} />
                      <ScoreDisplay value={app.scores?.curriculum} maxValue={20} />
                      <ScoreDisplay value={app.scores?.leadership} maxValue={20} />
                      <ScoreDisplay value={app.totalScore} variant="total" maxValue={60} />
                    </ApplicationItem>
                  ))
                ) : (
                  <p className="text-xs text-gray-300 italic px-4">No evaluations completed yet.</p>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-20 rounded-3xl shadow-sm border text-center">
          <p className="text-gray-400 font-bold">No scholarships currently assigned to your profile.</p>
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
