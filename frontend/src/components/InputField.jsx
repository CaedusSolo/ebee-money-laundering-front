import React from "react";

// Validation functions for different input types
const validators = {
    email: (value) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value) ? null : "Please enter a valid email address";
    },
    phone: (value) => {
        const re = /^[0-9]{10,11}$/;
        return re.test(value.replace(/[\s-]/g, '')) ? null : "Please enter a valid phone number (10-11 digits)";
    },
    icNumber: (value) => {
        const re = /^[0-9]{6}-[0-9]{2}-[0-9]{4}$|^[0-9]{12}$/;
        return re.test(value) ? null : "Please enter a valid IC number (e.g., 123456-12-1234)";
    },
    dateOfBirth: (value) => {
        const re = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
        return re.test(value) ? null : "Please use DD/MM/YYYY format";
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
    required = true 
}) => {
    const handleChange = (e) => {
        const newValue = e.target.value;
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
