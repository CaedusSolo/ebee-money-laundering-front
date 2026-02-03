import React, { useState, useEffect } from "react";
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
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationMessages, setValidationMessages] = useState([]);

    // Check form validity
    useEffect(() => {
        const messages = [];
        
        // Check required text fields
        const requiredFields = ['university', 'major', 'cgpa'];
        const allTextFieldsFilled = requiredFields.every(field => {
            const value = formData[field];
            return value && value.toString().trim() !== '';
        });
        
        // Add message for partially filled activities
        const hasPartialActivities = activities.some(activity => {
            const hasAnyValue = Object.values(activity).some(value => value && value.toString().trim() !== '');
            const hasAllValues = activity.activity && activity.activity.trim() !== '' &&
                                 activity.role && activity.role.trim() !== '';
            return hasAnyValue && !hasAllValues;
        });
        
        if (hasPartialActivities) {
            messages.push('Please fill in the whole row');
        }
        
        // Check dropdowns
        if (!formData.year || formData.year === '') {
            messages.push('Please select a year');
        }
        if (!formData.expectedGraduation || formData.expectedGraduation === '') {
            messages.push('Please select expected graduation year');
        }
        if (!formData.highestQualification || formData.highestQualification === '') {
            messages.push('Please select highest qualification');
        }
        
        // Check CGPA validity
        const cgpaValue = parseFloat(formData.cgpa);
        if (formData.cgpa && (isNaN(cgpaValue) || cgpaValue < 2.0 || cgpaValue > 4.0)) {
            messages.push('CGPA must be between 2.0 and 4.0');
        }
        
        // Check activities (at least 2 COMPLETELY filled rows)
        const filledActivities = activities.filter(activity => {
            // A row is considered filled only if ALL fields have values
            return activity.activity && activity.activity.trim() !== '' &&
                   activity.role && activity.role.trim() !== '';
        });
        
        // Check for partially filled rows (any field filled but not all fields filled)
        const hasPartiallyFilledActivities = activities.some(activity => {
            const hasAnyValue = Object.values(activity).some(value => value && value.toString().trim() !== '');
            const hasAllValues = activity.activity && activity.activity.trim() !== '' &&
                                 activity.role && activity.role.trim() !== '';
            return hasAnyValue && !hasAllValues;
        });
        
        // Check that filled activity fields meet minimum length requirement
        let activitiesValid = true;
        filledActivities.forEach((activity, index) => {
            ['activity', 'role'].forEach(field => {
                const value = activity[field];
                if (value && value.trim().length > 0 && value.trim().length < 3) {
                    activitiesValid = false;
                }
            });
        });
        
        // Check files
        const allFilesUploaded = files.transcript && files.payslip && files.ic;
        
        // Check no validation errors
        const hasActualErrors = Object.keys(errors).some(key => {
            const errorMsg = errors[key];
            return errorMsg && errorMsg.toString().trim() !== '';
        });
        
        const isValid = allTextFieldsFilled && 
                       formData.year && 
                       formData.expectedGraduation && 
                       formData.highestQualification &&
                       !isNaN(cgpaValue) && cgpaValue >= 2.0 && cgpaValue <= 4.0 &&
                       filledActivities.length >= 2 &&
                       activitiesValid &&
                       !hasPartiallyFilledActivities &&
                       allFilesUploaded &&
                       !hasActualErrors;
        
        setIsFormValid(isValid);
        setValidationMessages(messages);
    }, [formData, errors, activities, files]);

    // Handle activity field changes with validation
    const handleActivityFieldChange = (index, field, value) => {
        // Call the parent's activity change handler
        handleActivityChange(index, field, value);
        
        // Validate minimum length (3 characters) if field has content
        if (value.trim().length > 0 && value.trim().length < 3) {
            handleValidationError(`activity_${field}_${index}`, 'Minimum 3 characters required');
        } else {
            // Clear error if validation passes
            handleValidationError(`activity_${field}_${index}`, '');
        }
    };

    // Malaysian Universities list
    const universities = [
        "Universiti Malaya (UM)",
        "Universiti Kebangsaan Malaysia (UKM)",
        "Universiti Sains Malaysia (USM)",
        "Universiti Putra Malaysia (UPM)",
        "Universiti Teknologi Malaysia (UTM)",
        "Universiti Teknologi MARA (UiTM)",
        "Universiti Islam Antarabangsa Malaysia (UIAM)",
        "Universiti Utara Malaysia (UUM)",
        "Universiti Malaysia Sarawak (UNIMAS)",
        "Universiti Malaysia Sabah (UMS)",
        "Universiti Pendidikan Sultan Idris (UPSI)",
        "Universiti Teknikal Malaysia Melaka (UTeM)",
        "Universiti Tun Hussein Onn Malaysia (UTHM)",
        "Universiti Malaysia Perlis (UniMAP)",
        "Universiti Sultan Zainal Abidin (UniSZA)",
        "Universiti Malaysia Terengganu (UMT)",
        "Universiti Malaysia Kelantan (UMK)",
        "Universiti Malaysia Pahang (UMP)",
        "Universiti Sains Islam Malaysia (USIM)",
        "Universiti Pertahanan Nasional Malaysia (UPNM)",
        "Taylor's University",
        "Sunway University",
        "INTI International University",
        "Monash University Malaysia",
        "University of Nottingham Malaysia",
        "Heriot-Watt University Malaysia",
        "Curtin University Malaysia",
        "Swinburne University of Technology Sarawak",
        "UCSI University",
        "Multimedia University (MMU)",
        "Asia Pacific University (APU)",
        "Management and Science University (MSU)",
        "Binary University",
        "Perdana University",
        "Other"
    ];

    // Common majors/fields of study
    const majors = [
        "Computer Science",
        "Information Technology",
        "Software Engineering",
        "Data Science",
        "Artificial Intelligence",
        "Cybersecurity",
        "Business Administration",
        "Accounting",
        "Finance",
        "Marketing",
        "Economics",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Biomedical Engineering",
        "Medicine",
        "Pharmacy",
        "Dentistry",
        "Nursing",
        "Law",
        "Architecture",
        "Psychology",
        "Education",
        "Mass Communication",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Environmental Science",
        "Hospitality Management",
        "Culinary Arts",
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

    // Validate activities table (minimum 2 rows with ALL fields filled) and file uploads
    const validateActivities = () => {
        const filledRows = activities.filter(activity => {
            // A row is considered filled only if ALL fields have values
            return activity.activity && activity.activity.trim() !== '' &&
                    activity.role && activity.role.trim() !== '';
        });
        
        // Check for partially filled rows
        const hasPartiallyFilledRows = activities.some(activity => {
            const hasAnyValue = Object.values(activity).some(value => value && value.toString().trim() !== '');
            const hasAllValues = activity.activity && activity.activity.trim() !== '' &&
                                activity.role && activity.role.trim() !== '';
            return hasAnyValue && !hasAllValues;
        });
        
        if (hasPartiallyFilledRows) {
            handleValidationError('activities', 'Please fill in the whole row');
            return false;
        }
        
        if (filledRows.length < 2) {
            handleValidationError('activities', 'Please fill in at least 2 activities');
            return false;
        }
        
        // Check that filled activity fields meet minimum length requirement
        let activitiesValid = true;
        filledRows.forEach((activity, index) => {
            ['activity', 'role'].forEach(field => {
                const value = activity[field];
                if (value && value.trim().length > 0 && value.trim().length < 3) {
                    activitiesValid = false;
                }
            });
        });
        
        if (!activitiesValid) {
            return false;
        }
        
        // Check that all 3 required files are uploaded
        if (!files.transcript) {
            handleValidationError('transcript', 'Please upload transcript');
            return false;
        }
        if (!files.payslip) {
            handleValidationError('payslip', 'Please upload payslip');
            return false;
        }
        if (!files.ic) {
            handleValidationError('ic', 'Please upload copy of IC');
            return false;
        }
        
        // Clear the general activities error if validation passes
        handleValidationError('activities', '');
        // Clear file errors if validation passes
        handleValidationError('transcript', '');
        handleValidationError('payslip', '');
        handleValidationError('ic', '');
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
                            <option value="" disabled>Select University/College</option>
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
                            <option value="" disabled>Select Major</option>
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
                            <option value="" disabled>Select Year</option>
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
                        onChange={(field, value) => {
                            // Only allow numbers and one decimal point
                            const numericValue = value.replace(/[^\d.]/g, '');
                            
                            // Prevent multiple decimal points
                            const parts = numericValue.split('.');
                            if (parts.length > 2) return;
                            
                            // Limit to 4.00
                            const cgpaNum = parseFloat(numericValue);
                            if (!isNaN(cgpaNum) && cgpaNum > 4.0) return;
                            
                            handleInputChange(field, numericValue);
                        }}
                        onValidate={(field, error) => {
                            const cgpaValue = parseFloat(formData.cgpa);
                            if (formData.cgpa && (isNaN(cgpaValue) || cgpaValue < 2.0)) {
                                handleValidationError(field, 'CGPA must be at least 2.0');
                            } else if (formData.cgpa && cgpaValue > 4.0) {
                                handleValidationError(field, 'CGPA cannot exceed 4.0');
                            } else {
                                handleValidationError(field, error);
                            }
                        }}
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
                            <option value="" disabled>Select Year</option>
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
                            <option value="" disabled>Select Qualification</option>
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
                        *Please fill in at least 2 activities (all columns required for each row)
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
                                        className={`w-full p-2 outline-none focus:bg-blue-50 ${errors[`activity_activity_${i}`] ? 'border-2 border-red-500' : ''}`}
                                        value={act.activity}
                                        onChange={(e) =>
                                            handleActivityFieldChange(
                                                i,
                                                "activity",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors[`activity_activity_${i}`] && (
                                        <div className="text-red-500 text-xs mt-1 px-2">
                                            {errors[`activity_activity_${i}`]}
                                        </div>
                                    )}
                                </td>
                                <td className="border border-gray-300">
                                    <input
                                        className={`w-full p-2 outline-none focus:bg-blue-50 ${errors[`activity_role_${i}`] ? 'border-2 border-red-500' : ''}`}
                                        value={act.role}
                                        onChange={(e) =>
                                            handleActivityFieldChange(i, "role", e.target.value)
                                        }
                                    />
                                    {errors[`activity_role_${i}`] && (
                                        <div className="text-red-500 text-xs mt-1 px-2">
                                            {errors[`activity_role_${i}`]}
                                        </div>
                                    )}
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
                <div className="mb-4">
                    <p className="text-xs text-gray-600 italic">
                        *All 3 documents are required
                    </p>
                </div>
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

            <div className="flex flex-col items-center pt-10">
                {/* Validation Messages */}
                {!isFormValid && validationMessages.length > 0 && (
                    <div className="mb-4 text-red-600 text-sm font-semibold text-center">
                        {validationMessages.map((message, index) => (
                            <div key={index}>{message}</div>
                        ))}
                    </div>
                )}
                {!isFormValid && validationMessages.length === 0 && (
                    <div className="mb-4 text-red-600 text-sm font-semibold text-center">
                        Please fill in all required fields and upload all documents
                    </div>
                )}
                
                <div className="flex space-x-4">
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
                        disabled={!isFormValid}
                        className={`font-bold py-3 px-16 rounded-xl transition-colors shadow-lg ${
                            !isFormValid
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-800 hover:bg-blue-900 text-white'
                        }`}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AcademicInfoForm;
