"use client";

const LoadingSpinner = ({ 
  size = "large", 
  text = "Loading...", 
  className = "" 
}) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8", 
    large: "h-12 w-12",
    xlarge: "h-16 w-16"
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-pink-500 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-gray-600 text-center animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
