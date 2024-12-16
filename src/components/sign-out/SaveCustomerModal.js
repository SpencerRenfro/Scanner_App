import React from 'react'

function SaveCustomerModal({saveCustomerInfoChecked,setSaveCustomerInfoChecked,setShowSaveModal, handleSaveCustomerInfo}) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold">Save Customer Information</h2>
      <p className="mt-4">Would you like to save the customer information?</p>
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="save-customer-checkbox"
          className="mr-2"
          checked={saveCustomerInfoChecked}
          onChange={(e) => setSaveCustomerInfoChecked(e.target.checked)}
        />
        <label htmlFor="save-customer-checkbox">Save customer info</label>
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          className="btn btn-secondary"
          onClick={() => setShowSaveModal(false)}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowSaveModal(false);
            if (saveCustomerInfoChecked) {
              handleSaveCustomerInfo();
            }
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
  )
}

export default SaveCustomerModal