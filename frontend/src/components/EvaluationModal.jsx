import React, { useState, useEffect } from 'react';

const EvaluationModal = ({ isOpen, onClose, application, onSubmit }) => {
  // Internal state to manage the form within the modal
  const [formData, setFormData] = useState({
    academic: '',
    curriculum: '',
    leadership: '',
    comments: '',
  });

  // When the modal opens or the application prop changes, update the internal form state
  useEffect(() => {
    if (application) {
      setFormData({
        academic: application.scores.academic !== null ? application.scores.academic : '',
        curriculum: application.scores.curriculum !== null ? application.scores.curriculum : '',
        leadership: application.scores.leadership !== null ? application.scores.leadership : '',
        comments: application.comments || '',
      });
    }
  }, [application, isOpen]);

  if (!isOpen || !application) {
    return null;
  }

  // Handle form input changes
  const handleChange = (field, value) => {
    if (field === 'comments') {
      setFormData({ ...formData, [field]: value });
    } else {
      // Clamp scores between 0 and 20
      const score = value === '' ? '' : Math.max(0, Math.min(20, parseInt(value, 10)));
      setFormData({ ...formData, [field]: score });
    }
  };

  // Placeholder for document actions
  const handleDocumentAction = (action, docName) => {
    alert(`${action} triggered for: ${docName}`);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the final form data up to the parent component
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Evaluate: {application.id}</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Document Preview Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3">Submitted Documents</h3>
            <div className="flex space-x-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-gray-600">Transcript.pdf</span>
                <div className="flex space-x-2">
                  <button type="button" onClick={() => handleDocumentAction('Preview', 'Transcript.pdf')} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded">Preview</button>
                  <button type="button" onClick={() => handleDocumentAction('Download', 'Transcript.pdf')} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded">Download</button>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-gray-600">IC_Copy.pdf</span>
                <div className="flex space-x-2">
                  <button type="button" onClick={() => handleDocumentAction('Preview', 'IC_Copy.pdf')} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded">Preview</button>
                  <button type="button" onClick={() => handleDocumentAction('Download', 'IC_Copy.pdf')} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded">Download</button>
                </div>
              </div>
            </div>
          </div>

          {/* Rubrics Section */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Rubric Evaluation (0 - 20 pts)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Excellence</label>
                <input type="number" required min="0" max="20" value={formData.academic} onChange={(e) => handleChange('academic', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0 - 20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extra-curricular</label>
                <input type="number" required min="0" max="20" value={formData.curriculum} onChange={(e) => handleChange('curriculum', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0 - 20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leadership Quality</label>
                <input type="number" required min="0" max="20" value={formData.leadership} onChange={(e) => handleChange('leadership', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0 - 20" />
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Committee Comments</h3>
            <textarea
              rows="4"
              value={formData.comments}
              onChange={(e) => handleChange('comments', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your qualitative assessment and recommendation here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 shadow-sm">
              Submit Evaluation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal;
