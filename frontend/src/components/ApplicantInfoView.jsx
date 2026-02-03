import React from 'react';

const InfoGroup = ({ title, children }) => (
  <div className="mb-8">
    <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-[0.15em] mb-4 pb-2 border-b border-gray-100 flex items-center">
      <span className="bg-blue-900 w-1.5 h-1.5 rounded-full mr-2"></span>
      {title}
    </h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4">
      {children}
    </div>
  </div>
);

const Field = ({ label, value, isBoolean }) => {
  let displayValue = value;
  if (isBoolean) displayValue = value ? "YES" : "NO";

  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      <p className="text-sm font-semibold text-gray-800 leading-tight">
        {displayValue || <span className="text-gray-300 italic font-normal text-xs">Not Provided</span>}
      </p>
    </div>
  );
};

export default function ApplicantInfoView({ details }) {
  if (!details) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mb-4"></div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Retrieving database record...</p>
      </div>
    );
  }

  return (
    <div className="p-2 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* 1. Personal & Identity */}
      <InfoGroup title="Personal & Identity">
        <Field label="First Name" value={details.firstName} />
        <Field label="Last Name" value={details.lastName} />
        <Field label="Nationality" value={details.nationality} />
        <Field label="NRIC / ID Number" value={details.nricNumber} />
        <Field label="Gender" value={details.gender} />
        <Field label="Date of Birth" value={details.dateOfBirth} />
      </InfoGroup>

      {/* 2. Contact & Address */}
      <InfoGroup title="Contact & Address">
        <Field label="Phone Number" value={details.phoneNumber} />
        <div className="col-span-2">
            <Field label="Home Address" value={details.homeAddress} />
        </div>
        <Field label="City" value={details.city} />
        <Field label="State" value={details.state} />
        <Field label="Zip Code" value={details.zipCode} />
      </InfoGroup>

      {/* 3. Academic Details */}
      <InfoGroup title="Academic Record">
        <Field label="College / Institution" value={details.college} />
        <Field label="Major / Course" value={details.major} />
        <Field label="Level of Study" value={details.studyLevel} />
        <Field label="Current Year" value={details.currentYearOfStudy} />
        <Field label="Expected Graduation" value={details.expectedGraduationYear} />
      </InfoGroup>

      {/* 4. Financial & Eligibility */}
      <InfoGroup title="Financial Status">
        <Field
          label="Family Monthly Income"
          value={details.monthlyFamilyIncome ? `RM ${details.monthlyFamilyIncome.toLocaleString()}` : null}
        />
        <Field label="Bumiputera Status" value={details.isBumiputera} isBoolean />
      </InfoGroup>

      {/* 5. Family Members (List) */}
      <div className="mb-8">
        <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-[0.15em] mb-4 pb-2 border-b border-gray-100 flex items-center">
            <span className="bg-blue-900 w-1.5 h-1.5 rounded-full mr-2"></span>
            Family Background
        </h4>
        <div className="bg-gray-50/50 rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100/50 text-gray-400 font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Member Name</th>
                <th className="px-4 py-3">Relationship</th>
                <th className="px-4 py-3 text-right">Monthly Income</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {details.familyMembers?.length > 0 ? (
                details.familyMembers.map((m, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-bold text-gray-700">{m.memberName}</td>
                    <td className="px-4 py-3 text-gray-500 uppercase">{m.relationship}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-blue-700">RM {m.monthlyIncome?.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="px-4 py-6 text-center text-gray-300 italic">No family members declared</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Extracurricular Activities */}
      <div className="mb-8">
        <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-[0.15em] mb-4 pb-2 border-b border-gray-100 flex items-center">
            <span className="bg-blue-900 w-1.5 h-1.5 rounded-full mr-2"></span>
            Activities & Achievements
        </h4>
        <div className="space-y-3">
          {details.extracurriculars?.length > 0 ? (
            details.extracurriculars.map((activity, i) => (
              <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-gray-800">{activity.activityName}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{activity.role}</p>
                </div>
                <div className="text-right max-w-[200px]">
                   <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Achievement</p>
                   <p className="text-xs text-gray-600 leading-tight">{activity.achievement}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300 italic py-4 text-xs">No extracurricular records found</p>
          )}
        </div>
      </div>

      {/* 7. Supporting Documents (Nested DocumentInfo Structure) */}
      <div className="mb-4">
        <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-[0.15em] mb-4 pb-2 border-b border-gray-100 flex items-center">
            <span className="bg-blue-900 w-1.5 h-1.5 rounded-full mr-2"></span>
            Document Verification
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'NRIC Copy', doc: details.nricDoc },
            { label: 'Academic Transcript', doc: details.transcriptDoc },
            { label: 'Income Statement', doc: details.incomeDoc },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">{item.label}</p>
                  <p className="text-xs font-bold text-gray-700 truncate max-w-[140px]">
                    {item.doc?.fileName || 'Not Uploaded'}
                  </p>
                </div>
              </div>
              {item.doc?.fileUrl && (
                <a
                  href={item.doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm"
                >
                  VIEW
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
