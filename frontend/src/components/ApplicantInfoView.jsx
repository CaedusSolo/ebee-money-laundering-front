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
  if (!details) return <div className="py-10 text-center text-xs text-gray-400 animate-pulse">Loading Profile...</div>;

  const getFileUrl = (url, mode) => {
    if (!url) return "#";
    const fileName = url.split('/').pop();
    return `${import.meta.env.VITE_API_BASE_URL}/api/files/${mode}/${fileName}`;
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Group title="Personal Information">
        <Field label="Full Name" value={`${details.firstName} ${details.lastName}`} />
        <Field label="IC Number" value={details.nricNumber} />
        <Field label="Gender" value={details.gender} />
        <Field label="Nationality" value={details.nationality} />
        <Field label="Phone" value={details.phoneNumber} />
        <Field label="Date of Birth" value={details.dateOfBirth} />
      </Group>

      <Group title="Academic Details">
        <Field label="University" value={details.education?.college} />
        <Field label="Major" value={details.education?.major} />
        <Field label="Year of Study" value={details.education?.currentYearOfStudy} />
        <Field label="CGPA" value={details.cgpa} />
        <Field label="Study Level" value={details.education?.studyLevel} />
        <Field label="Graduation Year" value={details.education?.expectedGraduationYear} />
      </Group>

      <div className="mb-6">
        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3 pb-1 border-b">Extracurricular Activities</h4>
        {details.extracurriculars && details.extracurriculars.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="px-4 py-2">Activity Name</th>
                  <th className="px-4 py-2">Role / Achievement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {details.extracurriculars.map((ex, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2 font-semibold text-gray-700">{ex.activityName}</td>
                    <td className="px-4 py-2 text-gray-600">{ex.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No extracurricular activities listed.</p>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3 pb-1 border-b">Family Information</h4>
        <div className="mb-3 grid grid-cols-2 gap-4">
             <Field label="Household Income" value={details.monthlyFamilyIncome ? `RM ${details.monthlyFamilyIncome}` : null} />
             <Field label="Bumiputera Status" value={details.isBumiputera ? "Yes" : "No"} />
        </div>

        {details.familyMembers && details.familyMembers.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Relationship</th>
                  <th className="px-4 py-2">Occupation</th>
                  <th className="px-4 py-2 text-right">Income (RM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {details.familyMembers.map((fm, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2 font-semibold text-gray-700">{fm.name}</td>
                    <td className="px-4 py-2 text-gray-600">{fm.relationship}</td>
                    <td className="px-4 py-2 text-gray-600">{fm.occupation}</td>
                    <td className="px-4 py-2 text-right font-mono text-gray-600">{fm.monthlyIncome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No family members listed.</p>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3 pb-1 border-b">Verification Documents</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: 'NRIC Copy', doc: details.nricDoc },
            { label: 'Transcript', doc: details.transcriptDoc },
            { label: 'Income Proof', doc: details.familyIncomeConfirmationDoc },
          ].map((item, idx) => (
            <div key={idx} className="p-3 border rounded-xl flex items-center justify-between bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="overflow-hidden">
                  <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">{item.label}</p>
                  <p className="text-[10px] font-bold text-gray-700 truncate">{item.doc?.fileName || 'No file uploaded'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {item.doc?.fileUrl ? (
                  <>
                    <a href={getFileUrl(item.doc.fileUrl, 'view')} target="_blank" rel="noreferrer" className="text-[10px] font-black bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 uppercase transition-colors">View</a>
                    <a href={getFileUrl(item.doc.fileUrl, 'download')} className="text-[10px] font-black bg-[#1e3a8a] text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 uppercase transition-colors">Download</a>
                  </>
                ) : (
                  <span className="text-[10px] font-black text-gray-300 px-3 py-1.5 uppercase bg-gray-50 rounded-lg">Missing</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
