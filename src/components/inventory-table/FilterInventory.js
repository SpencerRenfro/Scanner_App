import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function FilterInventory({
  filter,
  setFilter,
  categories,
  activeCategory,
  setActiveCategory,
  activeStatus,
  setActiveStatus,
}) {
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'categories', or 'status'

  // Handle filter selection
  const handleFilterSelect = (value, type) => {
    if (type === "category") {
      // Update category but keep status
      setActiveCategory(value);
    } else if (type === "status") {
      // Update status but keep category
      setActiveStatus(value);
    } else if (type === "") {
      // Reset both when clicking All Items
      setActiveCategory("");
      setActiveStatus("");
    }

    // Always pass the current selection to parent
    // The parent component will decide how to filter based on both values
    setFilter(value);
    console.log(
      "Filter:",
      value,
      "Type:",
      typeof value,
      "Category:",
      activeCategory,
      "Status:",
      activeStatus
    );
  };

  // Reset active states when filter changes externally
  useEffect(() => {
    if (filter === "") {
      setActiveCategory("");
      setActiveStatus("");
    } else if (filter === "IN" || filter === "OUT") {
      setActiveStatus(filter);
      setActiveCategory("");
    } else {
      setActiveCategory(filter);
    }
  }, [filter, setActiveCategory, setActiveStatus]);

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Filter Inventory
      </h3>
      {/* Filter Tabs */}
      <div className="flex mb-2 border-b overflow-x-auto pb-1 scrollbar-hide">
        <button
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
            activeTab === "all"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => {
            setActiveTab("all");
            setActiveCategory("");
            setActiveStatus("");
            handleFilterSelect("", "");
          }}
        >
          All Items
        </button>
        <button
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
            activeTab === "categories"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
      </div>

      {/* Filter Content */}
      <div className="mt-2 overflow-x-auto pb-2">
        {activeTab === "all" && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterSelect("", "status")}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                activeStatus === ""
                  ? "bg-indigo-100 text-indigo-800 font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => handleFilterSelect("IN", "status")}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                activeStatus === "IN"
                  ? "bg-green-100 text-green-800 font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                Items In
              </span>
            </button>
            <button
              onClick={() => handleFilterSelect("OUT", "status")}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                activeStatus === "OUT"
                  ? "bg-red-100 text-red-800 font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                Items Out
              </span>
            </button>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2 ">
              <button
                onClick={() => handleFilterSelect("", "status")}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                  activeStatus === ""
                    ? "bg-indigo-100 text-indigo-800 font-medium shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => handleFilterSelect("IN", "status")}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                  activeStatus === "IN"
                    ? "bg-green-100 text-green-800 font-medium shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                  Items In
                </span>
              </button>
              <button
                onClick={() => handleFilterSelect("OUT", "status")}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                  activeStatus === "OUT"
                    ? "bg-red-100 text-red-800 font-medium shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                  Items Out
                </span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {/* Uncategorized filter button */}
              <button
                onClick={() => handleFilterSelect("Uncategorized", "category")}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                  activeCategory === "Uncategorized"
                    ? "bg-indigo-100 text-indigo-800 font-medium shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Uncategorized
              </button>

              {categories && categories.length > 0 ? (
                <>
                  {categories.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleFilterSelect(item.name, "category")}
                      className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                        activeCategory === item.name
                          ? "bg-indigo-100 text-indigo-800 font-medium shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                  <NavLink
                    to="/categories/manage"
                    className="ml-2 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors flex items-center justify-center"
                    title="Manage Categories"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </NavLink>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-500 italic">
                    No categories available
                  </span>
                  <NavLink
                    to="/categories/manage"
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors flex items-center justify-center"
                    title="Add Categories"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status filters - always visible */}
        <div className="mt-4">
          {/* <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by Status</h4> */}
          {/* <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterSelect('', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === '' ? 'bg-indigo-100 text-indigo-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All Status
          </button>
          <button
            onClick={() => handleFilterSelect('IN', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === 'IN' ? 'bg-green-100 text-green-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              Items In
            </span>
          </button>
          <button
            onClick={() => handleFilterSelect('OUT', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === 'OUT' ? 'bg-red-100 text-red-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
              Items Out
            </span>
          </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
