import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmationCard = ({ isOpen, onClose, item, action }) => {
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
    // Close the card
    onClose.onCancel();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose.onCancel}
      ></div>
      
      {/* Card */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-4 z-10 transform transition-all">
        <div className="bg-indigo-600 px-4 py-3">
          <h3 className="text-lg font-medium text-white">Confirm Action</h3>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 text-base mb-2">
              <span className="font-medium">{item.name}</span>
            </p>
            <p className="text-gray-600 text-sm">
              {action === 'OUT' 
                ? 'Are you sure you want to sign out this item?' 
                : 'Are you sure you want to sign in this item?'}
            </p>
          </div>
          
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500">
              {action === 'OUT' 
                ? 'You will be redirected to complete the sign-out process.' 
                : 'This will update the item status to "IN".'}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
              action === 'OUT' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'
            }`}
            onClick={handleConfirm}
          >
            {action === 'OUT' ? 'Continue to Sign Out' : 'Sign In'}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose.onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationCard;
