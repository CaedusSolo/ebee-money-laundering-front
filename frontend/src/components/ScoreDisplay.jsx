import React from 'react';

const ScoreDisplay = ({ value, variant = 'standard', maxValue, className = "" }) => {
  const variants = {
    standard: "bg-gray-200/60 border border-gray-300 text-gray-700",
    total: "bg-blue-800 text-white font-bold text-lg",
    reviewerTotal: "bg-gradient-to-br from-green-50 to-green-100 border border-green-200 text-green-600"
  };

  return (
    <div className={`w-16 h-10 flex flex-col items-center justify-center rounded-md font-medium transition-colors ${variants[variant]} ${className}`}>
      <span className={variant === 'total' ? 'text-lg' : 'text-sm'}>
        {value !== null && value !== undefined ? value : '-'}
      </span>
      {maxValue && <span className="text-[9px] opacity-70 mt-[-2px]">/{maxValue}</span>}
    </div>
  );
};

export default ScoreDisplay;
