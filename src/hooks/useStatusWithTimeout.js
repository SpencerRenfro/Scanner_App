import { useState, useEffect } from 'react';

/**
 * Custom hook to manage status messages with automatic timeout
 * @param {number} timeout - Timeout in milliseconds before the status is cleared
 * @returns {Array} - [status, setStatus] tuple similar to useState
 */
export const useStatusWithTimeout = (timeout = 5000) => {
  const [status, setStatusInternal] = useState(null);
  
  // Function to set status with timeout
  const setStatus = (newStatus) => {
    // Clear any existing timeout
    setStatusInternal(newStatus);
    
    // If status is success or error (not loading), set timeout to clear it
    if (newStatus && (newStatus.success === true || newStatus.success === false)) {
      setTimeout(() => {
        setStatusInternal(null);
      }, timeout);
    }
  };
  
  return [status, setStatus];
};
