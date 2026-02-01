import React, { useState } from 'react';

// Mock data to simulate fetching applications from the backend
const mockApplications = [
  {
    id: 'APPLICATION_ID1',
    status: 'Under Review',
    submittedDate: 'DD/MM/YYYY',
    scores: { academic: null, curriculum: null, leadership: null },
    totalScore: null,
  },
  {
    id: 'APPLICATION_ID2',
    status: 'Under Review',
    submittedDate: 'DD/MM/YYYY',
    scores: { academic: null, curriculum: null, leadership: null },
    totalScore: null,
  },
  {
    id: 'APPLICATION_ID3',
    status: 'Under Review',
    submittedDate: 'DD/MM/YYYY',
    scores: { academic: null, curriculum: null, leadership: null },
    totalScore: null,
  },
];

// Reusable component for each score input
const ScoreInput = ({ value, onChange }) => {
  return (
    <input
      type="number"
      value={value === null ? '' : value}
      onChange={onChange}
      className="w-20 text-center bg-gray-200/60 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      placeholder="-/20"
      min="0"
      max="20"
    />
  );
};

const ScholarshipCommitteeDashboard = () => {
  const [applications, setApplications] = useState(mockApplications);

  const handleScoreChange = (index, rubric, value) => {
    const newApplications = [...applications];
    const score = value === '' ? null : parseInt(value, 10);

    // Clamp the value between 0 and 20
    const clampedScore = Math.max(0, Math.min(20, score || 0));

    newApplications[index].scores[rubric] = value === '' ? null : clampedScore;

    // Recalculate total score
    const { academic, curriculum, leadership } = newApplications[index].scores;
    if (academic !== null && curriculum !== null && leadership !== null) {
      const totalRaw = academic + curriculum + leadership;
      // Normalize to 100
      newApplications[index].totalScore = Math.round((totalRaw / 60) * 100);
    } else {
      newApplications[index].totalScore = null;
    }

    setApplications(newApplications);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-cyan-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* Placeholder for logo */}
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-blue-700">FYJ</div>
            <h1 className="text-2xl font-bold text-white">Further Your Journey</h1>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-600">
            {/* Placeholder for Profile Icon */}
            P
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                profile image
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">FIRSTNAME LASTNAME</h2>
                <p className="text-gray-600">Scholarship Comittee</p>
                <p className="text-gray-500">alexarawles@fyj.edu.my</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition">
              Edit
            </button>
          </div>

          {/* Applications Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Merit's Scholarship Applications</h3>
                <div className="hidden md:flex items-center space-x-4 text-sm font-semibold text-gray-600">
                    <span>Academic</span>
                    <span>Curriculum</span>
                    <span>Leadership</span>
                    <span>Total Score</span>
                </div>
            </div>

            <div className="space-y-4">
              {applications.map((app, index) => (
                <div key={app.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between">
                  {/* Left Side: App Info */}
                  <div className="flex-1 mb-4 md:mb-0">
                    <h4 className="font-bold text-lg text-gray-900">{app.id}</h4>
                    <p className="text-sm text-gray-600">Status: {app.status}</p>
                    <p className="text-sm text-gray-500">Submitted: {app.submittedDate}</p>
                  </div>

                  {/* Right Side: Actions and Scores */}
                  <div className="flex items-center space-x-4">
                    {/* Icons */}
                    <button className="text-gray-500 hover:text-blue-600">[View Icon]</button>
                    <button className="text-gray-500 hover:text-blue-600">[Edit Icon]</button>

                    {/* Scores */}
                    <ScoreInput value={app.scores.academic} onChange={(e) => handleScoreChange(index, 'academic', e.target.value)} />
                    <ScoreInput value={app.scores.curriculum} onChange={(e) => handleScoreChange(index, 'curriculum', e.target.value)} />
                    <ScoreInput value={app.scores.leadership} onChange={(e) => handleScoreChange(index, 'leadership', e.target.value)} />

                    {/* Total Score */}
                    <div className="w-20 h-10 flex items-center justify-center bg-blue-600 text-white font-bold text-lg rounded-md">
                      {app.totalScore !== null ? app.totalScore : '100'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
            <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-md hover:bg-blue-700 transition shadow-lg">
                Submit
            </button>
        </div>
      </main>
    </div>
  );
};

export default ScholarshipCommitteeDashboard;
