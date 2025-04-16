import React from 'react';

function CustomersPagination({
  currentPage,
  setCurrentPage,
  customersPerPage,
  totalCustomers
}) {
  // Calculate total pages
  const totalPages = Math.ceil(totalCustomers / customersPerPage);
  
  // Handle page changes
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-3 space-x-2 text-sm">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        &lt; Prev
      </button>
      
      <span className="text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 rounded ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        Next &gt;
      </button>
    </div>
  );
}

export default CustomersPagination;
