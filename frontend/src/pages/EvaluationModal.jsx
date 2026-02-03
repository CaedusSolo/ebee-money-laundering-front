import React, { useState, useEffect } from 'react';
import ApplicantInfoView from '../components/ApplicantInfoView';
import { useAuth } from '../context/AuthContext';

const EvaluationModal = ({ isOpen, onClose, application, onSubmit }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [details, setDetails] = useState(null);
  const [localError, setLocalError] = useState('');
  const [formData, setFormData] = useState({ academic: '', curriculum: '', leadership: '', comments: '' });

  useEffect(() => {
    if (application && isOpen) {
      setFormData({
        academic: application.scores?.academic ?? '',
        curriculum: application.scores?.curriculum ?? '',
        leadership: application.scores?.leadership ?? '',
        comments: application.scores?.remarks || '',
      });
      fetchDetails();
    }
    setLocalError('');
    setActiveTab('profile');
  }, [application, isOpen]);

  const fetchDetails = async () => {
    try {
      const id = application?.id;
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/committee/application/${id}`, {
        headers: { 'Authorization': `Bearer ${currentUser?.token}` }
      });
      const data = await response.json();
      setDetails(data);
    } catch (err) { console.error("Failed to load details", err); }
  };

  const handleChange = (field, value) => {
    setLocalError('');
    if (field === 'comments') {
      setFormData({ ...formData, [field]: value });
    } else {
      if (/[^0-9]/.test(value) && value !== '') {
        setLocalError(`Numbers only for ${field}.`);
        return;
      }
      const num = value === '' ? '' : parseInt(value, 10);
      const score = num === '' ? '' : Math.max(0, Math.min(20, num));
      setFormData({ ...formData, [field]: score });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.comments?.trim()) {
      setLocalError("Assessment remarks are mandatory.");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-[#1e3a8a] text-white px-6 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">APP ID: {application.id}</h2>
            <button onClick={onClose} className="text-2xl">&times;</button>
          </div>
          <div className="flex space-x-6 text-[10px] font-bold uppercase">
            <button onClick={() => setActiveTab('profile')} className={`pb-2 border-b-2 ${activeTab === 'profile' ? 'border-white' : 'border-transparent text-blue-300'}`}>Profile</button>
            <button onClick={() => setActiveTab('evaluate')} className={`pb-2 border-b-2 ${activeTab === 'evaluate' ? 'border-white' : 'border-transparent text-blue-300'}`}>Grading</button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'profile' ? (
            <div className="space-y-4">
              <ApplicantInfoView details={details} />
              <button onClick={() => setActiveTab('evaluate')} className="w-full py-3 bg-blue-50 text-[#1e3a8a] font-bold rounded-xl border">Continue to Grading →</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {['academic', 'curriculum', 'leadership'].map(key => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{key}</label>
                    <input type="text" inputMode="numeric" required value={formData[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none" placeholder="0-20" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Remarks</label>
                <textarea rows="4" required value={formData.comments}
                  onChange={(e) => handleChange('comments', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none" placeholder="Justification..." />
              </div>
              {localError && <p className="text-red-600 text-xs font-bold animate-pulse">{localError}</p>}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-400 font-bold">Cancel</button>
                <button type="submit" className="px-8 py-2 bg-[#1e3a8a] text-white font-bold rounded-xl shadow-lg transition transform active:scale-95">Submit Grade</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
