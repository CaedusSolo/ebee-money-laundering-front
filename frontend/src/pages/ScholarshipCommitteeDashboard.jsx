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
      if (response.ok) setScholarshipGroups(data.scholarships || {});
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (currentUser) fetchDashboard(); }, [currentUser]);

  const handleOpenModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-400">Loading your dashboard...</div>;

  return (
    <div className="space-y-10">
      {Object.entries(scholarshipGroups).length > 0 ? (
        Object.entries(scholarshipGroups).map(([name, groups]) => (
          <div key={name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-800 mb-8 tracking-tight border-b pb-4">{name}</h3>

            {/* Pending Section */}
            <div className="mb-10">
              <h4 className="text-[10px] font-bold text-amber-500 uppercase mb-4 tracking-widest flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                Pending Evaluation ({groups.pending?.length || 0})
              </h4>
              <div className="space-y-3">
                {groups.pending?.map(app => (
                  <ApplicationItem key={app.id} title={app.studentName} status="PENDING" date={app.submittedAt}>
                    <ScoreDisplay value={null} maxValue={20} />
                    <ScoreDisplay value={null} maxValue={20} />
                    <ScoreDisplay value={null} maxValue={20} />
                    <ScoreDisplay value={0} variant="total" maxValue={60} />
                    <button onClick={() => handleOpenModal(app)} className="ml-4 p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold text-[10px] uppercase">Evaluate</button>
                  </ApplicationItem>
                ))}
                {(!groups.pending || groups.pending.length === 0) && (
                   <p className="text-sm text-gray-300 italic">No pending applications.</p>
                )}
              </div>
            </div>

            {/* Evaluated Section */}
            <div>
              <h4 className="text-[10px] font-bold text-emerald-500 uppercase mb-4 tracking-widest flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                Evaluated / Completed ({groups.evaluated?.length || 0})
              </h4>
              <div className="space-y-3">
                {groups.evaluated?.map(app => (
                  <ApplicationItem key={app.id} title={app.studentName} status="COMPLETED" date={app.submittedAt}>
                    <ScoreDisplay value={app.scores?.academic} maxValue={20} />
                    <ScoreDisplay value={app.scores?.curriculum} maxValue={20} />
                    <ScoreDisplay value={app.scores?.leadership} maxValue={20} />
                    <ScoreDisplay value={app.totalScore} variant="total" maxValue={60} />
                    <button onClick={() => handleOpenModal(app)} className="ml-4 p-2 text-gray-400 hover:text-blue-600 font-bold text-[10px] uppercase">View</button>
                  </ApplicationItem>
                ))}
                {(!groups.evaluated || groups.evaluated.length === 0) && (
                   <p className="text-sm text-gray-300 italic">No evaluated applications yet.</p>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 py-10">No scholarships assigned.</div>
      )}

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        application={selectedApp}
        onSubmit={async (data) => {
           await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/committee/evaluate/${selectedApp.id}`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentUser.token}` },
             body: JSON.stringify(data)
           });
           setIsModalOpen(false);
           fetchDashboard();
        }}
      />
    </div>
  );
}
