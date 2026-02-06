import React, { useCallback, useState, useEffect } from "react";
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
    const [isFormValid, setIsFormValid] = useState(false);

    // Check form validity only when key fields change
    useEffect(() => {
        const requiredFields = [
            'firstName', 'lastName', 'phoneNumber', 
            'dateOfBirth', 'icNumber', 'nationality', 'bumiputera', 
            'gender', 'homeAddress', 'monthlyHouseholdIncome'
        ];
        
        // Check all required fields are filled
        const allFieldsFilled = requiredFields.every(field => {
            const value = formData[field];
            return value && value.toString().trim() !== '' && 
                    value !== 'Select Gender' && value !== 'Select' && 
                    value !== 'Select Nationality';
        });
        
        // Check no validation errors - only count errors that have actual error messages
        const hasActualErrors = Object.keys(errors).some(key => {
            const errorMsg = errors[key];
            return errorMsg && errorMsg.toString().trim() !== '';
        });
        const noErrors = !hasActualErrors;
        
        // Check family members (at least 2 COMPLETELY filled rows)
        const filledRows = familyMembers.filter(member => {
            // A row is considered filled only if ALL fields have values
            return member.name && member.name.trim() !== '' &&
                    member.relationship && member.relationship.trim() !== '' &&
                    member.age && member.age.trim() !== '' &&
                    member.occupation && member.occupation.trim() !== '' &&
                    member.income && member.income.trim() !== '';
        });
        const familyValid = filledRows.length >= 2;
        
        // Check for partially filled rows (any field filled but not all fields filled)
        const hasPartiallyFilledRows = familyMembers.some(member => {
            const hasAnyValue = Object.values(member).some(value => value && value.toString().trim() !== '');
            const hasAllValues = member.name && member.name.trim() !== '' &&
                                member.relationship && member.relationship.trim() !== '' &&
                                member.age && member.age.trim() !== '' &&
                                member.occupation && member.occupation.trim() !== '' &&
                                member.income && member.income.trim() !== '';
            return hasAnyValue && !hasAllValues;
        });
        
        // Check that filled family fields meet minimum length requirement
        let familyFieldsValid = true;
        filledRows.forEach((member, index) => {
            ['name', 'relationship', 'occupation'].forEach(field => {
                const value = member[field];
                if (value && value.trim().length > 0 && value.trim().length < 3) {
                    familyFieldsValid = false;
                }
            });
        });
        
        const isValid = allFieldsFilled && noErrors && familyValid && familyFieldsValid && !hasPartiallyFilledRows;
        console.log('Form validation:', {
            allFieldsFilled,
            noErrors,
            familyValid,
            familyFieldsValid,
            hasPartiallyFilledRows,
            errors: errors,
            isValid
        });
        
        setIsFormValid(isValid);
    }, [formData, errors, familyMembers]);

    // Validate family members table (minimum 2 rows with ALL fields filled)
    const validateFamilyMembers = useCallback(() => {
        const filledRows = familyMembers.filter(member => {
            // A row is considered filled only if ALL fields have values
            return member.name && member.name.trim() !== '' &&
                    member.relationship && member.relationship.trim() !== '' &&
                    member.age && member.age.trim() !== '' &&
                    member.occupation && member.occupation.trim() !== '' &&
                    member.income && member.income.trim() !== '';
        });
        
        if (filledRows.length < 2) {
            handleValidationError('familyMembers', 'Please fill in at least 2 family members');
            return false;
        }
        // Clear error if validation passes
        if (errors.familyMembers) {
            handleValidationError('familyMembers', '');
        }
        return true;
    }, [familyMembers, handleValidationError, errors.familyMembers]);

    const handleNextClick = useCallback(() => {
        if (validateFamilyMembers()) {
            handleNext();
        }
    }, [validateFamilyMembers, handleNext]);

    // Handle family member income change - only allow numbers, max 1000000 (1 million RM)
    const handleFamilyIncomeChange = useCallback((index, value) => {
        // Remove all non-numeric characters
        const numericValue = value.replace(/[^\d]/g, '');
        
        // Limit to 1,000,000
        const incomeNum = parseInt(numericValue);
        if (incomeNum > 1000000) {
            return; // Don't update if over 1 million
        }
        
        handleFamilyChange(index, "income", numericValue);
    }, [handleFamilyChange]);

    // Handle family member name/relationship/occupation change - only allow letters and spaces
    const handleFamilyTextChange = useCallback((index, field, value) => {
        // Only allow letters and spaces
        const textValue = value.replace(/[^a-zA-Z\s]/g, '');
        handleFamilyChange(index, field, textValue);
        
        // Validate minimum length (3 characters) if field has content
        if (textValue.trim().length > 0 && textValue.trim().length < 3) {
            handleValidationError(`family_${field}_${index}`, 'Minimum 3 characters required');
        } else {
            // Clear error if validation passes
            handleValidationError(`family_${field}_${index}`, '');
        }
    }, [handleFamilyChange, handleValidationError]);

    // Handle family member age change - only allow numbers, max 120
    const handleFamilyAgeChange = useCallback((index, value) => {
        // Remove all non-numeric characters
        const numericValue = value.replace(/[^\d]/g, '');
        
        // Limit to 120
        const ageNum = parseInt(numericValue);
        if (ageNum > 120) {
            return; // Don't update if over 120
        }
        
        handleFamilyChange(index, "age", numericValue);
    }, [handleFamilyChange]);

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
                                        handleValidationError('dateOfBirth', 'Date of birth cannot be in the future');
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
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Nationality*
                        </label>
                        <select 
                            className={`border ${errors.nationality ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.nationality ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            value={formData.nationality || ""}
                            onChange={(e) => {
                                const newNationality = e.target.value;
                                handleInputChange('nationality', newNationality);
                                
                                // Clear IC/Passport field when nationality changes
                                handleInputChange('icNumber', '');
                                
                                // If changing to Non-Malaysian, set Bumiputera to No
                                if (newNationality === 'Non-Malaysian') {
                                    handleInputChange('bumiputera', 'No');
                                }
                            }}
                        >
                            <option value="" disabled>Select Nationality</option>
                            <option value="Malaysian">Malaysian</option>
                            <option value="Non-Malaysian">Non-Malaysian</option>
                        </select>
                        {errors.nationality && (
                            <span className="text-red-500 text-xs mt-1">{errors.nationality}</span>
                        )}
                    </div>
                    <InputField 
                        label={formData.nationality === 'Non-Malaysian' ? 'Passport Number' : 'IC Number'}
                        field="icNumber"
                        value={formData.icNumber}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.icNumber}
                        validationType={formData.nationality === 'Non-Malaysian' ? 'passportNumber' : 'icNumber'}
                        exampleFormat={formData.nationality === 'Non-Malaysian' ? 'A12345678' : '123456-12-1234'}
                    />
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Bumiputera*
                        </label>
                        <select 
                            className={`border ${errors.bumiputera ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.bumiputera ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            value={formData.bumiputera || ""}
                            onChange={(e) => handleInputChange('bumiputera', e.target.value)}
                            disabled={formData.nationality === 'Non-Malaysian'}
                        >
                            <option value="" disabled>Select</option>
                            <option value="Yes" disabled={formData.nationality === 'Non-Malaysian'}>Yes</option>
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
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {errors.gender && (
                            <span className="text-red-500 text-xs mt-1">{errors.gender}</span>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <InputField 
                        label="Home Address" 
                        field="homeAddress"
                        value={formData.homeAddress}
                        onChange={handleInputChange}
                        onValidate={handleValidationError}
                        error={errors.homeAddress}
                        validationType="text"
                    />
                </div>
            </section>

            {/* Family Section */}
            <section>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Family Information
                </h2>
                <div className="mb-6">
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                            Monthly Household Income*
                            <span className="text-gray-500 font-normal normal-case ml-1">
                                (e.g., RM5000)
                            </span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 font-semibold">
                                RM
                            </span>
                            <input
                                type="text"
                                placeholder="0"
                                value={formData.monthlyHouseholdIncome || ""}
                                onChange={(e) => {
                                    // Remove all non-numeric characters
                                    const numericValue = e.target.value.replace(/[^\d]/g, '');
                                    
                                    // Limit to 5,000,000 (5 million RM)
                                    const incomeNum = parseInt(numericValue);
                                    if (incomeNum > 5000000) {
                                        return; // Don't update if over 5 million
                                    }
                                    
                                    handleInputChange('monthlyHouseholdIncome', numericValue);
                                }}
                                onBlur={() => {
                                    if (formData.monthlyHouseholdIncome && parseFloat(formData.monthlyHouseholdIncome) < 0) {
                                        handleValidationError('monthlyHouseholdIncome', 'Please enter a valid amount');
                                    }
                                }}
                                className={`border ${errors.monthlyHouseholdIncome ? 'border-red-500' : 'border-gray-300'} rounded pl-12 pr-3 py-2 text-sm focus:outline-none focus:ring-1 ${errors.monthlyHouseholdIncome ? 'focus:ring-red-500' : 'focus:ring-blue-500'} w-full`}
                            />
                        </div>
                        {errors.monthlyHouseholdIncome && (
                            <span className="text-red-500 text-xs mt-1">{errors.monthlyHouseholdIncome}</span>
                        )}
                    </div>
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
                                            className={`w-full p-2 outline-none focus:bg-blue-50 ${errors[`family_name_${i}`] ? 'border-2 border-red-500' : ''}`}
                                            value={member.name}
                                            onChange={(e) =>
                                                handleFamilyTextChange(i, "name", e.target.value)
                                            }
                                        />
                                        {errors[`family_name_${i}`] && (
                                            <div className="text-red-500 text-xs mt-1 px-2">
                                                {errors[`family_name_${i}`]}
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300">
                                        <input
                                            className={`w-full p-2 outline-none focus:bg-blue-50 ${errors[`family_relationship_${i}`] ? 'border-2 border-red-500' : ''}`}
                                            value={member.relationship}
                                            onChange={(e) =>
                                                handleFamilyTextChange(i, "relationship", e.target.value)
                                            }
                                        />
                                        {errors[`family_relationship_${i}`] && (
                                            <div className="text-red-500 text-xs mt-1 px-2">
                                                {errors[`family_relationship_${i}`]}
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300">
                                        <input
                                            className="w-full p-2 outline-none focus:bg-blue-50"
                                            value={member.age}
                                            onChange={(e) =>
                                                handleFamilyAgeChange(i, e.target.value)
                                            }
                                        />
                                    </td>
                                    <td className="border border-gray-300">
                                        <input
                                            className={`w-full p-2 outline-none focus:bg-blue-50 ${errors[`family_occupation_${i}`] ? 'border-2 border-red-500' : ''}`}
                                            value={member.occupation}
                                            onChange={(e) =>
                                                handleFamilyTextChange(i, "occupation", e.target.value)
                                            }
                                        />
                                        {errors[`family_occupation_${i}`] && (
                                            <div className="text-red-500 text-xs mt-1 px-2">
                                                {errors[`family_occupation_${i}`]}
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">
                                                RM
                                            </span>
                                            <input
                                                type="text"
                                                className="w-full p-2 pl-10 outline-none focus:bg-blue-50"
                                                value={member.income}
                                                onChange={(e) =>
                                                    handleFamilyIncomeChange(i, e.target.value)
                                                }
                                                placeholder="0"
                                            />
                                        </div>
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

            <div className="flex flex-col items-center pt-10">
                {/* Validation Message */}
                {!isFormValid && (
                    <div className="mb-4 text-red-600 text-sm font-semibold text-center">
                        {(!formData.gender || formData.gender === 'Select Gender') && (
                            <div>Please select a gender</div>
                        )}
                        {(!formData.nationality || formData.nationality === 'Select Nationality') && (
                            <div>Please select a nationality</div>
                        )}
                        {(!formData.bumiputera || formData.bumiputera === 'Select') && (
                            <div>Please select Bumiputera status</div>
                        )}
                        {familyMembers.some(member => {
                            const hasAnyValue = Object.values(member).some(value => value && value.toString().trim() !== '');
                            const hasAllValues = member.name && member.name.trim() !== '' &&
                                                member.relationship && member.relationship.trim() !== '' &&
                                                member.age && member.age.trim() !== '' &&
                                                member.occupation && member.occupation.trim() !== '' &&
                                                member.income && member.income.trim() !== '';
                            return hasAnyValue && !hasAllValues;
                        }) && (
                            <div>Please fill in the whole row</div>
                        )}
                        {(formData.gender && formData.gender !== 'Select Gender' && 
                            formData.nationality && formData.nationality !== 'Select Nationality' && 
                            formData.bumiputera && formData.bumiputera !== 'Select' &&
                            !familyMembers.some(member => {
                                const hasAnyValue = Object.values(member).some(value => value && value.toString().trim() !== '');
                                const hasAllValues = member.name && member.name.trim() !== '' &&
                                                    member.relationship && member.relationship.trim() !== '' &&
                                                    member.age && member.age.trim() !== '' &&
                                                    member.occupation && member.occupation.trim() !== '' &&
                                                    member.income && member.income.trim() !== '';
                                return hasAnyValue && !hasAllValues;
                            })) && (
                            <div>Please fill in all required fields</div>
                        )}
                    </div>
                )}
                
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={handleNextClick}
                        disabled={!isFormValid}
                        className={`font-bold py-3 px-12 rounded-xl transition-colors ${
                            !isFormValid 
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
        </div>
    );
};

export default PersonalInfoForm;
