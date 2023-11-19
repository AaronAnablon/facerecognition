import React from 'react';

export default ModelLoading = ({ loadingMessage }) => (
  <div className="flex items-center justify-center min-h-150">
    <div className="mr-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-8 h-8 animate-spin text-gray-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4v.01M12 8V8M12 12v.01M12 16v.01M6 20v.01M6 4v.01M18 20v.01M18 4v.01"
        />
      </svg>
    </div>
    <div>{loadingMessage}</div>
  </div>
);
