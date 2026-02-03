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
    <p className="text-sm font-semibold text-gray-700">{value || <span className="text-gray-300 italic font-normal">N/A</span>}</p>
  </div>
);

export default function ApplicantInfoView({ details }) {
  if (!details) return <div className="py-10 text-center text-xs text-gray-400 animate-pulse">Loading Profile...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <Group title="Personal Information">
        <Field label="Name" value={`${details.firstName} ${details.lastName}`} />
        <Field label="NRIC" value={details.nricNumber} />
        <Field label="Gender" value={details.gender} />
        <Field label="Phone" value={details.phoneNumber} />
        <Field label="Nationality" value={details.nationality} />
      </Group>

      <Group title="Academic & Financial">
        <Field label="Major" value={details.major} />
        <Field label="Level" value={details.studyLevel} />
        <Field label="Graduation" value={details.expectedGraduationYear} />
        <Field label="Monthly Income" value={details.monthlyFamilyIncome ? `RM ${details.monthlyFamilyIncome}` : null} />
        <Field label="Bumiputera" value={details.bumiputera ? "YES" : "NO"} />
      </Group>

      <div className="mb-6">
        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3 pb-1 border-b">Family Members</h4>
        <div className="space-y-2">
          {details.familyMembers?.map((m, i) => (
            <div key={i} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
              <span className="font-bold">{m.memberName} ({m.relationship})</span>
              <span className="text-blue-700 font-mono">RM {m.monthlyIncome}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3 pb-1 border-b">Verification Documents</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'NRIC Copy', doc: details.nricDoc },
            { label: 'Academic Transcript', doc: details.transcriptDoc },
            { label: 'Income Statement', doc: details.familyIncomeConfirmationDoc },
          ].map((item, idx) => (
            <div key={idx} className="p-3 border rounded-xl flex items-center justify-between bg-white hover:border-blue-300 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">{item.label}</p>
                    <p className="text-[10px] font-bold text-gray-700 truncate max-w-[100px]">{item.doc?.fileName || 'Not Found'}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {item.doc?.fileUrl && (
                  <>
                    <a href={item.doc.fileUrl} target="_blank" rel="noreferrer"
                      className="text-[9px] font-black bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100">
                      VIEW
                    </a>
                    {/* NEW: Download Button */}
                    <a href={item.doc.fileUrl} download={item.doc.fileName}
                      className="text-[9px] font-black bg-blue-900 text-white px-2 py-1 rounded hover:bg-blue-800">
                      DL
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
