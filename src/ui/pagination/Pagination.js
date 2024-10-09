import { useState } from "react";
//icons
import next from "../../assets/icons/next.svg";
import back from "../../assets/icons/back.svg";

function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = 13; // Total number of items

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full flex justify-end items-center py-6 h-max gap-5">
      <div className="flex gap-5 h-max ">
        <div className="flex gap-3">
          <p>Rows per page: {itemsPerPage}</p>

          <div className="dropdown dropdown-right">
            <div tabIndex={0} role="button" className=" m-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -5 24 30"
                x="0px"
                y="0px"
                fill="#A6ADBB"
                width={22}
              >
                <title>Sort-Down-arrow-drop-triangle</title>
                <path d="M18,8H6a1,1,0,0,0-.71,1.71l6,6a1,1,0,0,0,1.41,0l6-6A1,1,0,0,0,18,8Z" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li onClick={() => setItemsPerPage(5)}>Item 5</li>
              <li onClick={() => setItemsPerPage(10)}>Item 10</li>
              <li onClick={() => setItemsPerPage(20)}>Item 20</li>
              <li onClick={() => setItemsPerPage(50)}>Item 50</li>
            </ul>
          </div>
        </div>

        <p>
          {currentPage * itemsPerPage - itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </p>
      </div>
      <div className="flex gap-10 h-max">
        <button onClick={handlePreviousPage}>
          <img src={back} width={20} alt="back button" />
        </button>
        <button onClick={handleNextPage}>
          <img src={next} width={20} alt="next button" className="" />
        </button>
        <h1>currentPage: {currentPage}</h1>
      </div>
    </div>
  );
}

export default Pagination;
