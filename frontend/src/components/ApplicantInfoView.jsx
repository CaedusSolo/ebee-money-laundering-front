import React from 'react';

const Group = ({ title, children }) => (
  <div className="mb-6">
    <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3 pb-1 border-b">{title}</h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">{label}</label>
    <p className="text-sm font-semibold text-gray-700 break-words">{value || <span className="text-gray-300 italic font-normal">N/A</span>}</p>
  </div>
);

export default function ApplicantInfoView({ details }) {
  if (!details) return <div className="py-10 text-center text-xs text-gray-400 animate-pulse">Loading Application Details...</div>;

  const getFileUrl = (url, mode) => {
    if (!url) return "#";
    const fileName = url.split('/').pop();
    return `${import.meta.env.VITE_API_BASE_URL}/api/files/${mode}/${fileName}`;
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Group title="Personal Information">
        <Field label="Full Name" value={`${details.firstName} ${details.lastName}`} />
        <Field label="NRIC" value={details.nricNumber} />
        <Field label="Contact" value={details.phoneNumber} />
        <Field label="Family Income" value={details.monthlyFamilyIncome ? `RM ${details.monthlyFamilyIncome}` : null} />
      </Group>

      <Group title="Education">
        <Field label="Institution" value={details.education?.college} />
        <Field label="Program" value={details.education?.major} />
        <Field label="CGPA" value={details.cgpa} />
      </Group>

      <div className="mb-4">
        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3 pb-1 border-b">Documents</h4>
        <div className="space-y-3">
          {[
            { label: 'NRIC / ID', doc: details.nricDoc },
            { label: 'Transcript', doc: details.transcriptDoc },
            { label: 'Income Proof', doc: details.familyIncomeConfirmationDoc },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xs font-bold text-gray-600 uppercase">{item.label}</span>
              <div className="flex gap-2">
                {item.doc?.fileUrl ? (
                  <>
                    <a href={getFileUrl(item.doc.fileUrl, 'view')} target="_blank" rel="noreferrer" className="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded text-[10px] font-bold uppercase hover:bg-blue-50">View</a>
                    <a href={getFileUrl(item.doc.fileUrl, 'download')} className="px-3 py-1 bg-[#1e3a8a] text-white rounded text-[10px] font-bold uppercase hover:bg-blue-800">Download</a>
                  </>
                ) : <span className="text-[10px] text-gray-300 italic px-2">Missing</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
