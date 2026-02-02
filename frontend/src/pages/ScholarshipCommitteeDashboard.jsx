import React, { useState, useEffect } from 'react';
import EvaluationModal from './EvaluationModal';
import Navbar from "../components/Navbar";
import personPlaceholder from "../assets/personPlaceholder.svg";
import ApplicationItem from "../components/ApplicationItem";
import ScoreDisplay from "../components/ScoreDisplay";
import { useAuth } from '../context/AuthContext';

const ScholarshipCommitteeDashboard = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [committeeInfo, setCommitteeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppIndex, setCurrentAppIndex] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Accessing the ID from the nested user object in AuthContext
        const committeeId = currentUser?.user?.id || currentUser?.id || 1;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/committee/dashboard/${committeeId}`, {
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`
          }
        });

        const data = await response.json();

        // Safety check to ensure applications exist before setting state
        if (response.ok && data.applications) {
          setApplications(data.applications);
          setCommitteeInfo(data.profile);
        } else {
          console.error("API Error:", data.error || "Unknown error");
          setApplications([]); // Reset to empty array to prevent .map() crash
        }
      } catch (error) {
        console.error("Failed to fetch committee dashboard:", error);
        setApplications([]); // Fallback to empty array on connection failure
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchDashboard();
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
    newApplications[appIndex].comments = modalData.comments;
    newApplications[appIndex].status = 'Graded';

    if (academic !== null && curriculum !== null && leadership !== null) {
      const totalRaw = academic + curriculum + leadership;
      // Normalizing score to a 100-point scale based on a max rubric of 60
      newApplications[appIndex].totalScore = Math.round((totalRaw / 60) * 100);
    }

    setApplications(newApplications);
    handleCloseModal();
    alert(`Evaluation submitted for ${newApplications[appIndex].id}!`);
  };

  if (loading) return <div className="pt-24 text-center">Loading Dashboard...</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Added pt-24 to prevent the fixed navbar from covering content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img src={personPlaceholder} alt="Profile" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 uppercase">
                  {currentUser?.user?.name || currentUser?.name || "Committee Member"}
                </h2>
                <p className="text-gray-600 font-medium">
                  {committeeInfo?.assignedScholarship || "Scholarship Committee"}
                </p>
                <p className="text-gray-500 text-sm">{currentUser?.user?.email || currentUser?.email}</p>
              </div>
            </div>
            <button className="bg-blue-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition">
              Edit Profile
            </button>
          </div>

          {/* Applications List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {committeeInfo?.assignedScholarship} Applications
              </h3>
              {/* Header labels for scores on larger screens */}
              <div className="hidden md:flex items-center space-x-3 text-sm font-semibold text-gray-600 mr-4">
                <div className="w-8"></div>
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
                    date={app.submittedDate}
                  >
                    <button
                      onClick={() => handleOpenModal(index)}
                      className="text-gray-600 hover:text-blue-600 transition"
                      title="Evaluate Application"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {/* Reusable ScoreDisplay components for consistency */}
                    <ScoreDisplay value={app.scores?.academic} maxValue={20} />
                    <ScoreDisplay value={app.scores?.curriculum} maxValue={20} />
                    <ScoreDisplay value={app.scores?.leadership} maxValue={20} />
                    <ScoreDisplay value={app.totalScore} variant="total" />
                  </ApplicationItem>
                ))
              ) : (
                <p className="text-gray-500 text-center py-10 italic">No applications currently assigned for review.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        application={currentAppIndex !== null ? applications[currentAppIndex] : null}
        onSubmit={handleSubmitEvaluation}
      />
    </div>
  );
};

export default ScholarshipCommitteeDashboard;
