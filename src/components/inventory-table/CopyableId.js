import React, { useState, useEffect } from 'react';

const CopyableId = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const [fadeState, setFadeState] = useState('hidden'); // 'hidden', 'fade-in', 'visible', 'fade-out'

  // Handle the fade-in and fade-out animation states
  useEffect(() => {
    let timer;

    if (copied) {
      // Start fade-in
      setFadeState('fade-in');

      // After fade-in completes, set to visible
      timer = setTimeout(() => {
        setFadeState('visible');

        // Start fade-out after being visible for a moment
        timer = setTimeout(() => {
          setFadeState('fade-out');

          // Reset after fade-out completes
          timer = setTimeout(() => {
            setCopied(false);
            setFadeState('hidden');
          }, 300); // Duration of fade-out
        }, 600); // Duration of visible state
      }, 300); // Duration of fade-in
    }

    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div
      className="relative cursor-pointer group flex items-center"
      onClick={handleCopy}
    >
      <p className="group-hover:text-indigo-600 transition-colors">{text}</p>

      {/* Copy icon that appears on hover */}
      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-500"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </span>

      {/* Copy animation and notification */}
      {copied && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div
            className={`absolute inset-0 bg-indigo-100 rounded transition-opacity duration-300 ${
              fadeState === 'hidden' ? 'opacity-0' :
              fadeState === 'fade-in' ? 'opacity-0 animate-fadeIn' :
              fadeState === 'visible' ? 'opacity-80' :
              'opacity-80 animate-fadeOut'
            }`}
          ></div>
          <div className={`z-10 flex items-center transition-opacity duration-300 ${
            fadeState === 'hidden' ? 'opacity-0' :
            fadeState === 'fade-in' ? 'opacity-0 animate-fadeIn' :
            fadeState === 'visible' ? 'opacity-100' :
            'opacity-100 animate-fadeOut'
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-600 animate-bounce"
              style={{ animationDuration: '0.7s' }} // Slightly slower bounce animation
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span className="ml-1 text-xs font-medium text-indigo-600">Copied!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyableId;
