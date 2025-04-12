import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatusChangeDialog = ({ isOpen, onClose, item, action }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (action === 'OUT') {
      // Navigate to sign-out page
      navigate(`/${item.id}/sign-out`);
    } else if (action === 'IN' && onClose.onConfirm) {
      // Handle sign-in action
      onClose.onConfirm();
    }
    // Close the dialog
    onClose.onCancel();
  };

  // Determine colors based on action
  const headerBgColor = action === 'OUT' ? 'bg-amber-600' : 'bg-green-600';
  const buttonBgColor = action === 'OUT' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700';
  const iconColor = action === 'OUT' ? 'text-amber-600' : 'text-green-600';

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 transition-opacity"
        onClick={onClose.onCancel}
      ></div>

      {/* Dialog Card */}
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-md mx-4 z-10 transform transition-all animate-slideIn">
        {/* Header */}
        <div className={`${headerBgColor} px-6 py-4 flex items-center`}>
          <div className="mr-3">
            {action === 'OUT' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-medium text-white">
            {action === 'OUT' ? 'Sign Out Item' : 'Sign In Item'}
          </h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className={`rounded-full p-3 ${action === 'OUT' ? 'bg-amber-100' : 'bg-green-100'} mr-4`}>
              {action === 'OUT' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-600">{item.category}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 text-base mb-4">
              {action === 'OUT'
                ? 'Are you sure you want to sign out this item?'
                : 'Are you sure you want to sign in this item?'}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                {action === 'OUT'
                  ? 'You will be redirected to complete the sign-out process with customer information.'
                  : 'This will update the item status to "IN" and make it available for others.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <button
            type="button"
            className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClose.onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${buttonBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 ${action === 'OUT' ? 'focus:ring-amber-500' : 'focus:ring-green-500'}`}
            onClick={handleConfirm}
          >
            {action === 'OUT' ? 'Continue to Sign Out' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeDialog;
