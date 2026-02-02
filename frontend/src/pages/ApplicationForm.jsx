import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const ScholarshipApplication = () => {

    const location = useLocation();
    // Extract the name from state, provide a fallback if accessed directly"
    // fix: added this function too js to avoid confusion on the forms
    const selectedScholarship = location.state?.scholarshipName || "Scholarship";

    const [step, setStep] = useState(1);

    // for the table datas
    const [familyMembers, setFamilyMembers] = useState(
        Array(5).fill({
        name: "",
        relationship: "",
        age: "",
        occupation: "",
        income: "",
        }),
    );
    const [activities, setActivities] = useState(
        Array(6).fill({ activity: "", role: "" }),
    );

    // handlers for dynamic inputs
    const handleFamilyChange = (index, field, value) => {
        const updated = [...familyMembers];
        updated[index] = { ...updated[index], [field]: value };
        setFamilyMembers(updated);
    };

    const handleActivityChange = (index, field, value) => {
        const updated = [...activities];
        updated[index] = { ...updated[index], [field]: value };
        setActivities(updated);
    };

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);
    const handleSave = () => {
        console.log("Saving family data:", familyMembers);
        alert("Progress saved!");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Final Submission:", { familyMembers, activities });
        alert("Application submitted successfully!");
    };

    const InputField = ({ label, type = "text", placeholder = "" }) => (
        <div className="flex flex-col">
        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
            {label}*
        </label>
        <input
            type={type}
            placeholder={placeholder}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        </div>
    );

    const FileUpload = ({ label }) => (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer shadow-sm">
        <p className="text-xs font-bold text-gray-700 uppercase mb-4 text-center">
            {label}*
        </p>
        <div className="bg-black text-white rounded-full p-3 mb-2">
            <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
            </svg>
        </div>
        <span className="text-xs font-semibold text-gray-500 uppercase">
            Upload
        </span>
        </div>
    );

    return (
        <div className="bg-blue-50/30 min-h-screen">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-10 pt-24">
                <div className="bg-white rounded-2xl shadow-sm p-10 border border-gray-100">
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Scholarship Application
                        </h1>
                        {/* Display the passed name here */}
                        <p className="text-blue-600 font-semibold mt-1">
                            Applying for: {selectedScholarship}
                        </p>
                    </header>

            <form onSubmit={handleSubmit}>
                {step === 1 ? (
                <div className="space-y-12">
                    {/* Personal Section */}
                    <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="First Name" />
                        <InputField label="Last Name" />
                        <InputField label="Email" type="email" />
                        <InputField label="Phone Number" />
                        <InputField
                        label="Date of Birth"
                        placeholder="DD/MM/YYYY"
                        />
                        <InputField label="IC Number" />
                        <InputField label="Nationality" />
                        <InputField label="Bumiputera (Yes/No)" />
                        <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Gender*
                        </label>
                        <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none">
                            <option>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                        </div>
                    </div>
                    </section>

                    {/* Family Section */}
                    <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Family Information
                    </h2>
                    <div className="mb-6">
                        <InputField label="Monthly Household Income" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-2 font-semibold text-gray-700">
                                Name of Guardians & Siblings
                            </th>
                            <th className="border border-gray-300 p-2 font-semibold text-gray-700">
                                Relationship
                            </th>
                            <th className="border border-gray-300 p-2 font-semibold text-gray-700">
                                Age
                            </th>
                            <th className="border border-gray-300 p-2 font-semibold text-gray-700">
                                Occupation
                            </th>
                            <th className="border border-gray-300 p-2 font-semibold text-gray-700">
                                Monthly Income
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {familyMembers.map((member, i) => (
                            <tr key={i}>
                                <td className="border border-gray-300">
                                <input
                                    className="w-full p-2 outline-none focus:bg-blue-50"
                                    value={member.name}
                                    onChange={(e) =>
                                    handleFamilyChange(i, "name", e.target.value)
                                    }
                                />
                                </td>
                                <td className="border border-gray-300">
                                <input
                                    className="w-full p-2 outline-none focus:bg-blue-50"
                                    value={member.relationship}
                                    onChange={(e) =>
                                    handleFamilyChange(
                                        i,
                                        "relationship",
                                        e.target.value,
                                    )
                                    }
                                />
                                </td>
                                <td className="border border-gray-300">
                                <input
                                    className="w-full p-2 outline-none focus:bg-blue-50"
                                    value={member.age}
                                    onChange={(e) =>
                                    handleFamilyChange(i, "age", e.target.value)
                                    }
                                />
                                </td>
                                <td className="border border-gray-300">
                                <input
                                    className="w-full p-2 outline-none focus:bg-blue-50"
                                    value={member.occupation}
                                    onChange={(e) =>
                                    handleFamilyChange(
                                        i,
                                        "occupation",
                                        e.target.value,
                                    )
                                    }
                                />
                                </td>
                                <td className="border border-gray-300">
                                <input
                                    className="w-full p-2 outline-none focus:bg-blue-50"
                                    value={member.income}
                                    onChange={(e) =>
                                    handleFamilyChange(
                                        i,
                                        "income",
                                        e.target.value,
                                    )
                                    }
                                />
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </section>

                    <div className="flex justify-center space-x-4 pt-10">
                    <button
                        type="button"
                        onClick={handleNext}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-12 rounded-xl transition-colors"
                    >
                        Next
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-12 rounded-xl transition-colors"
                    >
                        Save
                    </button>
                    </div>
                </div>
                ) : (
                /* PAGE 2: ACADEMIC INFORMATION */
                <div className="space-y-12">
                    <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Academic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="University/College" />
                        <InputField label="Major" />
                        <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Year*
                        </label>
                        <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none">
                            <option>Select Year</option>
                            <option>Year 1</option>
                            <option>Year 2</option>
                            <option>Year 3</option>
                        </select>
                        </div>
                        <InputField label="CGPA" />
                        <InputField label="Expected Graduation Year" />
                        <InputField label="Highest Academic Qualification" />
                    </div>
                    </section>

                    <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Extracurricular Activities
                    </h2>
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-2 font-semibold text-gray-700">
                            Activities
                            </th>
                            <th className="border border-gray-300 p-2 font-semibold text-gray-700">
                            Roles
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {activities.map((act, i) => (
                            <tr key={i}>
                            <td className="border border-gray-300">
                                <input
                                className="w-full p-2 outline-none focus:bg-blue-50"
                                value={act.activity}
                                onChange={(e) =>
                                    handleActivityChange(
                                    i,
                                    "activity",
                                    e.target.value,
                                    )
                                }
                                />
                            </td>
                            <td className="border border-gray-300">
                                <input
                                className="w-full p-2 outline-none focus:bg-blue-50"
                                value={act.role}
                                onChange={(e) =>
                                    handleActivityChange(i, "role", e.target.value)
                                }
                                />
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </section>

                    <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Supporting Documents
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <FileUpload label="Transcript" />
                        <FileUpload label="3 Months Payslip" />
                    </div>
                    <div className="max-w-xl mx-auto">
                        <FileUpload label="Copy of IC" />
                    </div>
                    </section>

                    <div className="flex justify-center space-x-4 pt-10">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-12 rounded-xl transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-16 rounded-xl transition-colors shadow-lg"
                    >
                        Submit
                    </button>
                    </div>
                </div>
                )}
            </form>
            </div>
        </main>
        </div>
    );
};

export default ScholarshipApplication;
