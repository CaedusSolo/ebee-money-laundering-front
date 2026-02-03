import React, { useEffect } from "react";
import InputField from "./InputField";

const PersonalInfoForm = ({ 
    formData, 
    errors, 
    familyMembers,
    handleInputChange,
    handleValidationError, 
    handleFamilyChange,
    handleNext,
    handleSave 
}) => {
    // Validate family members table (minimum 2 rows filled)
    const validateFamilyMembers = () => {
        const filledRows = familyMembers.filter(member => {
            return Object.values(member).some(value => value && value.toString().trim() !== '');
        });
        
        if (filledRows.length < 2) {
            handleValidationError('familyMembers', 'Please fill in at least 2 family members');
            return false;
        }
        return true;
    };

    // Validate all required fields on page 1
    const validatePage1 = () => {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phoneNumber', 
            'dateOfBirth', 'icNumber', 'nationality', 'bumiputera', 
            'gender', 'monthlyHouseholdIncome'
        ];
        
        let isValid = true;
        
        // Check all required fields are filled
        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].toString().trim() === '' || formData[field] === 'Select Gender' || formData[field] === 'Select') {
                isValid = false;
            }
        });
        
        // Check if there are any validation errors
        if (Object.keys(errors).length > 0) {
            isValid = false;
        }
        
        // Check family members
        if (!validateFamilyMembers()) {
            isValid = false;
        }
        
        return isValid;
    };

    const handleNextClick = () => {
        if (validateFamilyMembers()) {
            handleNext();
        }
    };

    // Handle family member income change - only allow numbers
    const handleFamilyIncomeChange = (index, value) => {
        // Remove all non-numeric characters except decimal point
        const numericValue = value.replace(/[^\d.]/g, '');
        handleFamilyChange(index, "income", numericValue);
    };

    // Check if Next button should be disabled
    const isNextDisabled = !validatePage1();

    return (
        <div className="space-y-12">
            {/* Personal Section */}
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                        label="First Name" 
                        field="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.firstName}
                        validationType="name"
                    />
                    <InputField 
                        label="Last Name" 
                        field="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.lastName}
                        validationType="name"
                    />
                    <InputField 
                        label="Email" 
                        type="email"
                        field="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.email}
                        validationType="email"
                    />
                    <InputField 
                        label="Phone Number"
                        field="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.phoneNumber}
                        validationType="phone"
                        exampleFormat="012-3456789"
                    />
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Date of Birth*
                        </label>
                        <input
                            type="date"
                            value={formData.dateOfBirth || ""}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            onBlur={(e) => {
                                const value = e.target.value;
                                if (value) {
                                    const selectedDate = new Date(value);
                                    const today = new Date();
                                    const minDate = new Date();
                                    minDate.setFullYear(today.getFullYear() - 100);
                                    
                                    if (selectedDate > today) {
                                        handleValidationError('dateOfBirth', 'Please enter a valid date of birth');
                                    } else if (selectedDate < minDate) {
                                        handleValidationError('dateOfBirth', 'Please enter a valid date of birth');
                                    } else {
                                        const minAge = new Date();
                                        minAge.setFullYear(today.getFullYear() - 16);
                                        if (selectedDate > minAge) {
                                            handleValidationError('dateOfBirth', 'You must be at least 16 years old');
                                        }
                                    }
                                }
                            }}
                            max={new Date().toISOString().split('T')[0]} // Prevent future dates in date picker
                            min={new Date(new Date().getFullYear() - 100, 0, 1).toISOString().split('T')[0]} // Prevent dates too far in past
                            className={`border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.dateOfBirth ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                        />
                        {errors.dateOfBirth && (
                            <span className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</span>
                        )}
                    </div>
                    <InputField 
                        label="IC Number"
                        field="icNumber"
                        value={formData.icNumber}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.icNumber}
                        validationType="icNumber"
                        exampleFormat="123456-12-1234"
                    />
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Nationality*
                        </label>
                        <select 
                            className={`border ${errors.nationality ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.nationality ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            value={formData.nationality || ""}
                            onChange={(e) => handleInputChange('nationality', e.target.value)}
                        >
                            <option value="">Select Nationality</option>
                            <option value="Malaysian">Malaysian</option>
                            <option value="Non-Malaysian">Non-Malaysian</option>
                        </select>
                        {errors.nationality && (
                            <span className="text-red-500 text-xs mt-1">{errors.nationality}</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Bumiputera*
                        </label>
                        <select 
                            className={`border ${errors.bumiputera ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.bumiputera ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            value={formData.bumiputera || ""}
                            onChange={(e) => handleInputChange('bumiputera', e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        {errors.bumiputera && (
                            <span className="text-red-500 text-xs mt-1">{errors.bumiputera}</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Gender*
                        </label>
                        <select 
                            className={`border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.gender ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            value={formData.gender || ""}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {errors.gender && (
                            <span className="text-red-500 text-xs mt-1">{errors.gender}</span>
                        )}
                    </div>
                </div>
            </section>

            {/* Family Section */}
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Family Information
                </h2>
                <div className="mb-6">
                    <InputField 
                        label="Monthly Household Income"
                        field="monthlyHouseholdIncome"
                        value={formData.monthlyHouseholdIncome}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.monthlyHouseholdIncome}
                        validationType="number"
                    />
                </div>
                <div className="mb-2">
                    <p className="text-xs text-gray-600 italic">
                        *Please fill in at least 2 family members
                    </p>
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
                                    Monthly Income (RM)
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
                                            type="text"
                                            className="w-full p-2 outline-none focus:bg-blue-50"
                                            value={member.income}
                                            onChange={(e) =>
                                                handleFamilyIncomeChange(i, e.target.value)
                                            }
                                            placeholder="0.00"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {errors.familyMembers && (
                    <span className="text-red-500 text-xs mt-1">{errors.familyMembers}</span>
                )}
            </section>

            <div className="flex justify-center space-x-4 pt-10">
                <button
                    type="button"
                    onClick={handleNextClick}
                    disabled={isNextDisabled}
                    className={`font-bold py-3 px-12 rounded-xl transition-colors ${
                        isNextDisabled 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    }`}
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
    );
};

export default PersonalInfoForm;
