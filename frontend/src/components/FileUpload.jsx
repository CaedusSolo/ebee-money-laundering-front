import React from "react";

const FileUpload = React.memo(({ 
    label, 
    field, 
    file, 
    onChange,
    onValidate, 
    error,
    acceptedFormats = ".pdf",
    maxSizeMB = 5
}) => {
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        
        if (selectedFile) {
            // Validate file size
            const fileSizeMB = selectedFile.size / (1024 * 1024);
            if (fileSizeMB > maxSizeMB) {
                if (onValidate) {
                    onValidate(field, `File size must be less than ${maxSizeMB}MB`);
                }
                return;
            }
            
            // Validate file type
            const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
            const acceptedArray = acceptedFormats.split(',');
            if (!acceptedArray.includes(fileExtension)) {
                if (onValidate) {
                    onValidate(field, `Please upload a valid file type (${acceptedFormats})`);
                }
                return;
            }
            
            onChange(field, selectedFile);
        }
    };

    return (
        <div className="flex flex-col">
            <label
                htmlFor={`file-${field}`}
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer shadow-sm"
            >
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
                        />
                    </svg>
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase">
                    {file ? file.name : 'Upload'}
                </span>
                {file && (
                    <span className="text-xs text-gray-400 mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                    </span>
                )}
                <input
                    id={`file-${field}`}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept={acceptedFormats}
                />
            </label>
            {error && (
                <span className="text-red-500 text-xs mt-1">{error}</span>
            )}
        </div>
    );
});

export default FileUpload;
