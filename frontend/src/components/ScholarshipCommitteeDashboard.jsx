import React, { useState } from 'react';
import EvaluationModal from './EvaluationModal'; // Import the new component

// Mock data
const initialApplications = [
  { id: 'APPLICATION_ID1', status: 'Under Review', submittedDate: '15/01/2026', scores: { academic: null, curriculum: null, leadership: null }, comments: '', totalScore: null },
  { id: 'APPLICATION_ID2', status: 'Under Review', submittedDate: '16/01/2026', scores: { academic: null, curriculum: null, leadership: null }, comments: '', totalScore: null },
  { id: 'APPLICATION_ID3', status: 'Under Review', submittedDate: '18/01/2026', scores: { academic: null, curriculum: null, leadership: null }, comments: '', totalScore: null },
];

const ScoreDisplay = ({ value }) => (
  <div className="w-16 h-10 flex items-center justify-center bg-gray-200/60 border border-gray-300 rounded-md text-gray-700 font-medium">
    {value !== null ? value : '-'}
  </div>
);

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

  // This function receives the data from the modal and updates the main state
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
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-cyan-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-blue-700">FYJ</div>
            <h1 className="text-2xl font-bold text-white">Further Your Journey</h1>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden"><span className="text-xs">Profile Img</span></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">FIRSTNAME LASTNAME</h2>
                <p className="text-gray-600">Scholarship Committee</p>
                <p className="text-gray-500 text-sm">alexarawles@fyj.edu.my</p>
              </div>
            </div>
            <button className="bg-blue-800 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition">Edit</button>
          </div>

          {/* Applications List Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Merit's Scholarship Applications
              </h3>
              <div className="hidden md:flex items-center space-x-6 text-sm font-semibold text-gray-600">
                <span className="w-16 text-center">Academic</span><span className="w-16 text-center">Curriculum</span><span className="w-16 text-center">Leadership</span><span className="w-16 text-center">Total Score</span>
              </div>
            </div>
            <div className="space-y-4">
              {applications.map((app, index) => (
                <div key={app.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="flex-1 mb-4 md:mb-0 border-l-4 border-blue-600 pl-3">
                    <h4 className="font-bold text-lg text-gray-900">{app.id}</h4>
                    <p className="text-sm text-gray-600 mt-1">Status: {app.status}</p>
                    <p className="text-sm text-gray-400">Submitted: {app.submittedDate}</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <button onClick={() => handleOpenModal(index)} className="text-gray-600 hover:text-blue-600 transition" title="Evaluate Application">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <ScoreDisplay value={app.scores.academic} /><ScoreDisplay value={app.scores.curriculum} /><ScoreDisplay value={app.scores.leadership} />
                    <div className="w-16 h-10 flex items-center justify-center bg-blue-800 text-white font-bold text-lg rounded-md">{app.totalScore !== null ? app.totalScore : '-'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Render the modal component */}
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
