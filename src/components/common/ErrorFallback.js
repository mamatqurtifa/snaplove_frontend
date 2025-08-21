"use client";

import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const ErrorFallback = ({ 
  error, 
  onRetry, 
  title = "Something went wrong", 
  className = "" 
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-xl p-6 text-center ${className}`}>
      <FiAlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-4">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FiRefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
