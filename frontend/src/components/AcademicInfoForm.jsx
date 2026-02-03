import React from "react";
import InputField from "./InputField";
import FileUpload from "./FileUpload";

const AcademicInfoForm = ({ 
    formData, 
    errors, 
    files,
    activities,
    handleInputChange,
    handleValidationError,
    handleFileChange,
    handleActivityChange,
    handleBack,
    handleSubmit
}) => {

    const universities = [
        "Universiti Malaya (UM)",
        "Universiti Kebangsaan Malaysia (UKM)",
        "Universiti Putra Malaysia (UPM)",
        "Universiti Teknologi Malaysia (UTM)",
        "Universiti Teknologi MARA (UiTM)",
        "Universiti Islam Antarabangsa Malaysia (UIAM)",
        "Universiti Utara Malaysia (UUM)",
        "Universiti Malaysia Sarawak (UNIMAS)",
        "Universiti Malaysia Sabah (UMS)",
        "Universiti Sains Islam Malaysia (USIM)",,
        "Taylor's University",
        "Sunway University",
        "INTI International University",
        "Monash University Malaysia",
        "University of Nottingham Malaysia",
        "Heriot-Watt University Malaysia",
        "UCSI University",
        "Multimedia University (MMU)",
        "Asia Pacific University (APU)",
        "Management and Science University (MSU)",
        "Other"
    ];

    const majors = [
        "Computer Science",
        "Information Technology",
        "Business Administration",
        "Accounting",
        "Finance",
        "Marketing",
        "Economics",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Law",
        "Cinematic Arts",
        "Creative Multimedia",
        "Communication",
        "Other"
    ];

    // Graduation years (current year + next 10 years)
    const currentYear = new Date().getFullYear();
    const graduationYears = Array.from({ length: 11 }, (_, i) => currentYear + i);

    // Highest qualifications
    const qualifications = [
        "SPM",
        "STPM",
        "A-Levels",
        "Foundation",
        "Diploma",
        "Matriculation",
        "Other"
    ];

    // Validate activities table (second row must be completely filled)
    const validateActivities = () => {
        // Check if the second row (index 1) is completely filled
        const secondRow = activities[1];
        
        if (!secondRow.activity || secondRow.activity.trim() === '' || 
            !secondRow.role || secondRow.role.trim() === '') {
            handleValidationError('activities', 'Please fill in all fields in the second row (Activity and Role)');
            return false;
        }
        
        return true;
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (validateActivities()) {
            // Call the parent's submit handler
            if (handleSubmit) {
                handleSubmit();
            }
        }
    };

    return (
        <div className="space-y-12">
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Academic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            University/College*
                        </label>
                        <select 
                            className={`border ${errors.university ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.university ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            value={formData.university || ""}
                            onChange={(e) => handleInputChange('university', e.target.value)}
                        >
                            <option value="">Select University/College</option>
                            {universities.map((uni, index) => (
                                <option key={index} value={uni}>{uni}</option>
                            ))}
                        </select>
                        {errors.university && (
                            <span className="text-red-500 text-xs mt-1">{errors.university}</span>
                        )}
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Major*
                        </label>
                        <select 
                            className={`border ${errors.major ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.major ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            value={formData.major || ""}
                            onChange={(e) => handleInputChange('major', e.target.value)}
                        >
                            <option value="">Select Major</option>
                            {majors.map((major, index) => (
                                <option key={index} value={major}>{major}</option>
                            ))}
                        </select>
                        {errors.major && (
                            <span className="text-red-500 text-xs mt-1">{errors.major}</span>
                        )}
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Year*
                        </label>
                        <select 
                            className={`border ${errors.year ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.year ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            value={formData.year || ""}
                            onChange={(e) => handleInputChange('year', e.target.value)}
                        >
                            <option value="">Select Year</option>
                            <option value="Year 1">Year 1</option>
                            <option value="Year 2">Year 2</option>
                            <option value="Year 3">Year 3</option>
                            <option value="Year 4">Year 4</option>
                        </select>
                        {errors.year && (
                            <span className="text-red-500 text-xs mt-1">{errors.year}</span>
                        )}
                    </div>
                    
                    <InputField 
                        label="CGPA"
                        field="cgpa"
                        value={formData.cgpa}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.cgpa}
                        validationType="cgpa"
                    />
                    
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Expected Graduation Year*
                        </label>
                        <select 
                            className={`border ${errors.expectedGraduation ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.expectedGraduation ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            value={formData.expectedGraduation || ""}
                            onChange={(e) => handleInputChange('expectedGraduation', e.target.value)}
                        >
                            <option value="">Select Year</option>
                            {graduationYears.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        {errors.expectedGraduation && (
                            <span className="text-red-500 text-xs mt-1">{errors.expectedGraduation}</span>
                        )}
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Highest Academic Qualification*
                        </label>
                        <select 
                            className={`border ${errors.highestQualification ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.highestQualification ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            value={formData.highestQualification || ""}
                            onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                        >
                            <option value="">Select Qualification</option>
                            {qualifications.map((qual, index) => (
                                <option key={index} value={qual}>{qual}</option>
                            ))}
                        </select>
                        {errors.highestQualification && (
                            <span className="text-red-500 text-xs mt-1">{errors.highestQualification}</span>
                        )}
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Extracurricular Activities
                </h2>
                <div className="mb-2">
                    <p className="text-xs text-gray-600 italic">
                        *Please fill in all fields in the second row (Activity and Role are required)
                    </p>
                </div>
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
                {errors.activities && (
                    <span className="text-red-500 text-xs mt-1">{errors.activities}</span>
                )}
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Supporting Documents
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <FileUpload 
                        label="Transcript" 
                        field="transcript"
                        file={files.transcript}
                        onChange={handleFileChange}
                        onValidate={handleValidationError}
                        error={errors.transcript}
                        maxSizeMB={5}
                    />
                    <FileUpload 
                        label="3 Months Payslip" 
                        field="payslip"
                        file={files.payslip}
                        onChange={handleFileChange}
                        onValidate={handleValidationError}
                        error={errors.payslip}
                        maxSizeMB={5}
                    />
                </div>
                <div className="max-w-xl mx-auto">
                    <FileUpload 
                        label="Copy of IC" 
                        field="ic"
                        file={files.ic}
                        onChange={handleFileChange}
                        onValidate={handleValidationError}
                        error={errors.ic}
                        maxSizeMB={5}
                    />
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
                    type="button"
                    onClick={handleSubmitClick}
                    className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-16 rounded-xl transition-colors shadow-lg"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default AcademicInfoForm;
