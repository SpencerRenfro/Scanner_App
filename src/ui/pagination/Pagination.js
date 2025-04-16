import { useEffect } from "react";
//icons
import next from "../../assets/icons/next.svg";
import back from "../../assets/icons/back.svg";

function Pagination({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
  onPageChange
}) {
  // Handle page changes
  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (onPageChange) onPageChange(newPage, itemsPerPage);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (onPageChange) onPageChange(newPage, itemsPerPage);
    }
  };

  // Handle items per page changes
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    // Reset to page 1 when changing items per page
    setCurrentPage(1);
    if (onPageChange) onPageChange(1, newItemsPerPage);
  };

  // Recalculate when total items changes
  useEffect(() => {
    const maxPage = Math.ceil(totalItems / itemsPerPage) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
      if (onPageChange) onPageChange(maxPage, itemsPerPage);
    }
  }, [totalItems, itemsPerPage, currentPage, setCurrentPage, onPageChange]);

  // Calculate page information
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between sm:justify-end items-center py-4 sm:py-6 gap-4 sm:gap-5 dark:text-white">
      <div className="flex flex-wrap gap-4 sm:gap-5 items-center">
        <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
          <p className="whitespace-nowrap">Rows: {itemsPerPage}</p>

          <div className="dropdown dropdown-right">
            <div tabIndex={0} role="button" className="m-1 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -5 24 30"
                x="0px"
                y="0px"
                fill="#A6ADBB"
                width={18}
                height={18}
                className="w-4 sm:w-5"
              >
                <title>Sort-Down-arrow-drop-triangle</title>
                <path d="M18,8H6a1,1,0,0,0-.71,1.71l6,6a1,1,0,0,0,1.41,0l6-6A1,1,0,0,0,18,8Z" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 dark:bg-gray-800 dark:text-white rounded-box z-[1] w-36 sm:w-52 p-2 shadow text-sm"
            >
              <li onClick={() => handleItemsPerPageChange(5)} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 p-1 rounded">5 items</li>
              <li onClick={() => handleItemsPerPageChange(10)} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 p-1 rounded">10 items</li>
              <li onClick={() => handleItemsPerPageChange(20)} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 p-1 rounded">20 items</li>
              <li onClick={() => handleItemsPerPageChange(50)} className="cursor-pointer hover:bg-slate-100 p-1 rounded">50 items</li>
            </ul>
          </div>
        </div>

        <p className="text-sm sm:text-base whitespace-nowrap">
          {totalItems > 0 ? `${startItem}-${endItem} of ${totalItems}` : 'No items'}
        </p>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={handlePreviousPage}
          className="p-1 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50"
          disabled={currentPage <= 1}
        >
          <img src={back} width={16} height={16} alt="back button" className="w-4 sm:w-5" />
        </button>
        <span className="text-sm sm:text-base">{currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          className="p-1 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50"
          disabled={currentPage >= totalPages}
        >
          <img src={next} width={16} height={16} alt="next button" className="w-4 sm:w-5" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
