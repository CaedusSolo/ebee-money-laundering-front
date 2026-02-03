import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const EvaluationModal = ({ isOpen, onClose, application, onSubmit }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [details, setDetails] = useState(null);
  const [localError, setLocalError] = useState('');
  const [formData, setFormData] = useState({ academic: '', curriculum: '', leadership: '', comments: '' });

  useEffect(() => {
    if (application && isOpen) {
      // Pull scores from main branch ElementCollection structure
      const findScore = (cat) => application.scores?.find(s => s.category === cat)?.score || '';
      const findRemarks = () => application.scores?.[0]?.remarks || '';

      setFormData({
        academic: findScore('ACADEMIC'),
        curriculum: findScore('CURRICULUM'),
        leadership: findScore('LEADERSHIP'),
        comments: findRemarks(),
      });
      fetchDetails();
    }
    setLocalError('');
    setActiveTab('profile');
  }, [application, isOpen]);

  const fetchDetails = async () => {
    try {
      const id = application?.id || 1;
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
      // 1. SYMBOL DETECTION: Prevent non-numeric entry
      if (/[^0-9]/.test(value) && value !== '') {
        setLocalError(`Numbers only for ${field}.`);
        return;
      }
      // 2. ZERO TRUNCATION: parse to integer handles '07' or '00'
      const num = value === '' ? '' : parseInt(value, 10);
      const score = num === '' ? '' : Math.max(0, Math.min(20, num));
      setFormData({ ...formData, [field]: score });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 3. MANDATORY COMMENTS check
    if (!formData.comments.trim()) {
      setLocalError("Please provide an assessment justification.");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

        <div className="bg-[#1e3a8a] text-white px-6 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold uppercase tracking-tight">App ID: {application.id}</h2>
            <button onClick={onClose} className="text-blue-200 hover:text-white transition text-2xl">&times;</button>
          </div>
          <div className="flex space-x-8 text-[11px] font-bold uppercase tracking-widest">
            <button onClick={() => setActiveTab('profile')} className={`pb-3 border-b-2 transition-colors ${activeTab === 'profile' ? 'border-white' : 'border-transparent text-blue-300'}`}>Profile</button>
            <button onClick={() => setActiveTab('evaluate')} className={`pb-3 border-b-2 transition-colors ${activeTab === 'evaluate' ? 'border-white' : 'border-transparent text-blue-300'}`}>Grading</button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              {/* Applicant view is displayed here if component exists */}
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                Viewing profile for Application {application.id}...
              </div>
              <button onClick={() => setActiveTab('evaluate')} className="w-full py-3 bg-blue-50 text-[#1e3a8a] font-bold rounded-xl hover:bg-blue-100 transition shadow-sm border border-blue-100">Proceed to Grade →</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {['academic', 'curriculum', 'leadership'].map((key) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">{key}</label>
                    <input
                      type="text" inputMode="numeric" required
                      value={formData[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition font-semibold"
                      placeholder="0-20"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Remarks</label>
                <textarea
                  rows="4" required
                  value={formData.comments}
                  onChange={(e) => handleChange('comments', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] outline-none transition text-sm"
                  placeholder="Justify scores here..."
                />
              </div>

              {localError && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded animate-pulse">{localError}</div>}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button type="button" onClick={onClose} className="px-6 py-2 text-gray-400 font-bold hover:text-gray-600 transition">Cancel</button>
                <button type="submit" className="px-8 py-2 bg-[#1e3a8a] text-white font-bold rounded-xl hover:bg-blue-800 shadow-lg transition transform active:scale-95">Submit Grade</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
