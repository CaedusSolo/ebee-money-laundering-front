import React from 'react';

const Group = ({ title, children }) => (
  <div className="mb-6">
    <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3 pb-1 border-b">{title}</h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</div>
  </div>
);

const getPlaceholder = (label) => {
  const placeholders = {
    "IC Number": "020515-10-5432",
    "Date of Birth": "15/05/2002",
    "Gender": "Male",
    "Phone": "012-345-6789",
    "Nationality": "Malaysian",
    "University": "Multimedia University (MMU)",
    "Major": "Computer Science",
    "Current Year": "Year 2",
    "CGPA": "3.85",
    "Graduation Year": "2026",
    "Study Level": "Bachelor's Degree",
    "Household Income": "RM 4,500",
    "Bumiputera Status": "Yes"
  };
  return placeholders[label] || "N/A";
};

const Field = ({ label, value }) => {
  const isMissing = !value || value === "";
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">{label}</label>
      <p className={`text-sm font-semibold ${isMissing ? 'text-gray-700' : 'text-gray-700'}`}>
        {isMissing ? getPlaceholder(label) : value}
      </p>
    </div>
  );
};

export default function ApplicantInfoView({ details }) {
  const d = details || {};

  return (
    <div className="animate-in fade-in duration-500">
      {/* 1. Personal Information Section */}
      <Group title="Personal Information">
        <Field
          label="Name"
          value={d.firstName ? `${d.firstName} ${d.lastName}` : "Ahmad Danial Bin Ridzuan"}
        />
        <Field label="IC Number" value={d.icNumber} />
        <Field label="Date of Birth" value={d.dateOfBirth} />
        <Field label="Gender" value={d.gender} />
        <Field label="Phone" value={d.phoneNumber} />
        <Field label="Nationality" value={d.nationality} />
      </Group>

      {/* 2. Academic Details Section */}
      <Group title="Academic Details">
        <Field label="University" value={d.university} />
        <Field label="Major" value={d.major} />
        <Field label="Current Year" value={d.year} />
        <Field label="CGPA" value={d.cgpa} />
        <Field label="Graduation Year" value={d.expectedGraduation} />
        <Field label="Study Level" value={d.highestQualification} />
      </Group>

      {/* 3. Financial & Background Section */}
      <Group title="Financial & Background">
        <Field
          label="Household Income"
          value={d.monthlyHouseholdIncome ? `RM ${d.monthlyHouseholdIncome}` : null}
        />
        <Field label="Bumiputera Status" value={d.bumiputera} />
      </Group>

      {/* 4. Family Members Section */}
      <div className="mb-6">
        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3 pb-1 border-b">Family Members</h4>
        <div className="space-y-2">
          {d.familyMembers && d.familyMembers.length > 0 ? (
            d.familyMembers.map((m, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-gray-50 p-2 rounded items-center border">
                <span className="font-bold">{m.name}</span>
                <span className="text-gray-500">{m.relationship}</span>
                <span className="text-gray-500">{m.occupation}</span>
                <span className="text-blue-700 font-mono text-right">RM {m.income}</span>
              </div>
            ))
          ) : (
            // Dummy Family Members for preview
            [
              { name: "Mohd Ridzuan", relationship: "Father", occupation: "Civil Servant", income: "3800" },
              { name: "Siti Aminah", relationship: "Mother", occupation: "Homemaker", income: "0" }
            ].map((m, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-gray-50 p-2 rounded items-center border opacity-40 italic">
                <span className="font-bold">{m.name}</span>
                <span className="text-gray-500">{m.relationship}</span>
                <span className="text-gray-500">{m.occupation}</span>
                <span className="text-blue-700 font-mono text-right">RM {m.income}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 5. Verification Documents Section */}
      <div className="mb-6">
        <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3 pb-1 border-b">Verification Documents</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'IC Copy', doc: d.nricDoc, defaultName: "nric_front_back.pdf" },
            { label: 'Academic Transcript', doc: d.transcriptDoc, defaultName: "official_transcript_latest.pdf" },
            { label: 'Income Statement', doc: d.familyIncomeConfirmationDoc, defaultName: "ea_form_2024.pdf" },
          ].map((item, idx) => {
            const hasFile = !!item.doc?.fileUrl;
            return (
              <div key={idx} className="p-3 border rounded-xl flex items-center justify-between bg-white hover:border-blue-300 transition-colors shadow-sm">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${hasFile ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-300'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-1">{item.label}</p>
                    <p className={`text-[10px] font-bold truncate ${hasFile ? 'text-gray-700' : 'text-gray-300 italic'}`}>
                      {item.doc?.fileName || item.defaultName}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5 flex-shrink-0">
                  <a
                    href={item.doc?.fileUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-[9px] font-black px-2 py-1 rounded uppercase ${hasFile ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-gray-50 text-gray-300 pointer-events-none'}`}
                  >
                    View
                  </a>
                  <a
                    href={item.doc?.fileUrl || "#"}
                    download={item.doc?.fileName || item.defaultName}
                    className={`text-[9px] font-black px-2 py-1 rounded uppercase ${hasFile ? 'bg-[#1e3a8a] text-white hover:bg-blue-800' : 'bg-gray-100 text-gray-300 pointer-events-none'}`}
                  >
                    DL
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
