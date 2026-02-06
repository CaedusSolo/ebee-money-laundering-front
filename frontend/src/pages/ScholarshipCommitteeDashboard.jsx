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
  const [warningMsg, setWarningMsg] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setWarningMsg(null);

      // FIX: Call new endpoint without ID. The backend uses the Token to identify you.
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/committee/dashboard`, {
        headers: { 'Authorization': `Bearer ${currentUser?.token}` }
      });

      const data = await response.json();

      if (response.ok) {
        if (data.warning) {
            setWarningMsg(data.warning); // Show backend warning
        }
        setScholarshipGroups(data.scholarships || {});
      } else {
        console.error("Dashboard error:", data);
        setWarningMsg(data.error || "Failed to load dashboard.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setWarningMsg("Network error. Please try again.");
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

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-400">Loading dashboard...</div>;

  return (
    <div className="space-y-10">

      {/* Warning Banner for Missing Profile */}
      {warningMsg && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center">
            <svg className="w-6 h-6 mr-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
                <p className="font-bold">System Message:</p>
                <p className="text-sm">{warningMsg}</p>
            </div>
        </div>
      )}

      {Object.entries(scholarshipGroups).length > 0 ? (
        Object.entries(scholarshipGroups).map(([name, groups]) => (
          <div key={name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-800 mb-8 tracking-tight border-b pb-4">{name}</h3>

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
              </div>
            </div>

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
              </div>
            </div>
          </div>
        ))
      ) : (
        !warningMsg && (
            <div className="text-center text-gray-400 py-10">No scholarships assigned.</div>
        )
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
