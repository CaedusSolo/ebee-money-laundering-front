import React, { useState } from 'react';
import EvaluationModal from './EvaluationModal';
import Navbar from "../components/Navbar";
import personPlaceholder from "../assets/personPlaceholder.svg";
import ApplicationItem from "../components/ApplicationItem";
import ScoreDisplay from "../components/ScoreDisplay";

const initialApplications = [
  { id: 'APPLICATION_ID1', status: 'Pending', submittedDate: '15/01/2026', scores: { academic: null, curriculum: null, leadership: null }, comments: '', totalScore: null },
  { id: 'APPLICATION_ID2', status: 'Pending', submittedDate: '16/01/2026', scores: { academic: null, curriculum: null, leadership: null }, comments: '', totalScore: null },
  { id: 'APPLICATION_ID3', status: 'Pending', submittedDate: '18/01/2026', scores: { academic: null, curriculum: null, leadership: null }, comments: '', totalScore: null },
];

const ScholarshipCommitteeDashboard = () => {
  const [applications, setApplications] = useState(initialApplications);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppIndex, setCurrentAppIndex] = useState(null);

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
      newApplications[appIndex].totalScore = Math.round((totalRaw / 60) * 100);
    }

    setApplications(newApplications);
    handleCloseModal();
    alert(`Evaluation submitted for ${newApplications[appIndex].id}!`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                <img src={personPlaceholder} alt="Profile Image" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">FIRSTNAME LASTNAME</h2>
                <p className="text-gray-600">Scholarship Committee</p>
                <p className="text-gray-500 text-sm">alexarawles@mmu.edu.my</p>
              </div>
            </div>
            <button className="bg-blue-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition">Edit</button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Merit's Scholarship Applications
              </h3>
              <div className="hidden md:flex items-center space-x-3 text-sm font-semibold text-gray-600 mr-4">
                <div className="w-8"></div> {/* Spacer for Eye Icon */}
                <span className="w-16 text-center">Academic</span>
                <span className="w-16 text-center">Co-Curric.</span>
                <span className="w-16 text-center">Leadership</span>
                <span className="w-16 text-center">Total</span>
              </div>
            </div>

            <div className="space-y-4">
              {applications.map((app, index) => (
                <ApplicationItem
                  key={app.id}
                  title={app.id}
                  status={app.status}
                  date={app.submittedDate}
                >
                  <button onClick={() => handleOpenModal(index)} className="text-gray-600 hover:text-blue-600 transition" title="Evaluate">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <ScoreDisplay value={app.scores.academic} maxValue={20} />
                  <ScoreDisplay value={app.scores.curriculum} maxValue={20} />
                  <ScoreDisplay value={app.scores.leadership} maxValue={20} />
                  <ScoreDisplay value={app.totalScore} variant="total" />
                </ApplicationItem>
              ))}
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
