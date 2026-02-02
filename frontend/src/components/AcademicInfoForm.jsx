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
    handleBack 
}) => {
    // Validate activities table (minimum 2 rows filled)
    const validateActivities = () => {
        const filledRows = activities.filter(activity => {
            return Object.values(activity).some(value => value && value.toString().trim() !== '');
        });
        
        if (filledRows.length < 2) {
            handleValidationError('activities', 'Please fill in at least 2 activities');
            return false;
        }
        return true;
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (validateActivities()) {
            // Trigger the parent form's submit
            e.target.closest('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    return (
        <div className="space-y-12">
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Academic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                        label="University/College"
                        field="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.university}
                    />
                    <InputField 
                        label="Major"
                        field="major"
                        value={formData.major}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.major}
                    />
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Year*
                        </label>
                        <select 
                            className={`border ${errors.year ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none ${errors.year ? 'focus:ring-red-500' : ''}`}
                            value={formData.year}
                            onChange={(e) => handleInputChange('year', e.target.value)}
                        >
                            <option>Select Year</option>
                            <option>Year 1</option>
                            <option>Year 2</option>
                            <option>Year 3</option>
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
                    <InputField 
                        label="Expected Graduation Year"
                        field="expectedGraduation"
                        value={formData.expectedGraduation}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.expectedGraduation}
                        validationType="year"
                    />
                    <InputField 
                        label="Highest Academic Qualification"
                        field="highestQualification"
                        value={formData.highestQualification}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.highestQualification}
                    />
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Extracurricular Activities
                </h2>
                <div className="mb-2">
                    <p className="text-xs text-gray-600 italic">
                        *Please fill in at least 2 activities
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
