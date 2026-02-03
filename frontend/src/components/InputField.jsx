import React from "react";

// Validation functions for different input types
const validators = {
    email: (value) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value) ? null : "Please enter a valid email address";
    },
    phone: (value) => {
        // Format: 012-3456789 (3 digits, dash, 7 or 8 digits)
        const re = /^01[0-9]-[0-9]{7,8}$/;
        return re.test(value) ? null : "Please enter phone number in format: 012-3456789";
    },
    icNumber: (value) => {
        // Format: 123456-12-1234 (6 digits, dash, 2 digits, dash, 4 digits)
        const re = /^[0-9]{6}-[0-9]{2}-[0-9]{4}$/;
        return re.test(value) ? null : "Please enter IC number in format: 123456-12-1234";
    },
    dateOfBirth: (value) => {
        if (!value) return "Date of birth is required";
        
        const selectedDate = new Date(value);
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 100); // 100 years ago
        
        // Check if date is in the future
        if (selectedDate > today) {
            return "Please enter a valid date of birth";
        }
        
        // Check if date is too far in the past
        if (selectedDate < minDate) {
            return "Please enter a valid date of birth";
        }
        
        // Check if person is at least 16 years old (typical minimum age for scholarship)
        const minAge = new Date();
        minAge.setFullYear(today.getFullYear() - 16);
        if (selectedDate > minAge) {
            return "You must be at least 16 years old";
        }
        
        return null;
    },
    cgpa: (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0 || num > 4.0) {
            return "Please enter a valid CGPA (0.0 - 4.0)";
        }
        return null;
    },
    year: (value) => {
        const currentYear = new Date().getFullYear();
        const yearNum = parseInt(value);
        if (isNaN(yearNum) || yearNum < currentYear || yearNum > currentYear + 10) {
            return "Please enter a valid year";
        }
        return null;
    },
    number: (value) => {
        return isNaN(value) || parseFloat(value) < 0 ? "Please enter a valid amount" : null;
    },
    yesNo: (value) => {
        return ['yes', 'no'].includes(value.toLowerCase()) ? null : "Please enter 'Yes' or 'No'";
    },
    name: (value) => {
        // Only allow letters and spaces, no numbers or special characters
        const re = /^[a-zA-Z\s]+$/;
        return re.test(value) ? null : "Name can only contain letters";
    }
};

const InputField = React.memo(({ 
    label, 
    type = "text", 
    placeholder = "", 
    field, 
    value, 
    onChange, 
    onValidate,
    error,
    validationType = null,
    required = true,
    exampleFormat = ""
}) => {
    const handleChange = (e) => {
        let newValue = e.target.value;
        
        // For phone numbers, auto-format with dash
        if (validationType === 'phone') {
            // Remove all non-digits
            newValue = newValue.replace(/\D/g, '');
            
            // Add dash after 3rd digit if there are more than 3 digits
            if (newValue.length > 3) {
                newValue = newValue.slice(0, 3) + '-' + newValue.slice(3, 11);
            }
        }
        
        // For IC numbers, auto-format with dashes
        if (validationType === 'icNumber') {
            // Remove all non-digits
            newValue = newValue.replace(/\D/g, '');
            
            // Add dashes at appropriate positions
            if (newValue.length > 6) {
                if (newValue.length > 8) {
                    newValue = newValue.slice(0, 6) + '-' + newValue.slice(6, 8) + '-' + newValue.slice(8, 12);
                } else {
                    newValue = newValue.slice(0, 6) + '-' + newValue.slice(6, 8);
                }
            }
        }
        
        // For name fields, prevent numbers
        if (validationType === 'name') {
            // Only allow letters and spaces
            newValue = newValue.replace(/[^a-zA-Z\s]/g, '');
        }
        
        onChange(field, newValue);
    };

    const handleBlur = () => {
        // Validate on blur if validation type is specified
        if (validationType && validators[validationType] && onValidate) {
            const validationError = validators[validationType](value || "");
            if (validationError) {
                onValidate(field, validationError);
            }
        }
    };

    return (
        <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-700 uppercase mb-1">
                {label}{required && '*'}
                {exampleFormat && (
                    <span className="text-gray-500 font-normal normal-case ml-1">
                        (e.g., {exampleFormat})
                    </span>
                )}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
            />
            {error && (
                <span className="text-red-500 text-xs mt-1">{error}</span>
            )}
        </div>
    );
});

// Export validators for external use if needed
export { validators };
export default InputField;
