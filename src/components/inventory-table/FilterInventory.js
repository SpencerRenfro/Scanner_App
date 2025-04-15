import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";

export default function FilterInventory({
  filter,
  setFilter,
  categories,
  activeCategory,
  setActiveCategory,
  activeStatus,
  setActiveStatus,
  customers: checkedOutCustomers, // Rename to clarify these are customers with checked out items
  activeCustomer,
  setActiveCustomer,
}) {
  // Fetch all saved customers from the API
  const {
    data: savedCustomers,
    isPending: isLoadingCustomers,
    error: customersError,
  } = useFetch("http://localhost:8000/customers");

  // Debug: Log customers props
  useEffect(() => {
    console.log("Checked out customers:", checkedOutCustomers);
    console.log("Saved customers:", savedCustomers);
  }, [checkedOutCustomers, savedCustomers]);

  // Debug function to check customer data
  const debugCustomerData = () => {
    console.log("Active customer:", activeCustomer);
    console.log("All saved customers:", savedCustomers);
    console.log("Checked out customers:", checkedOutCustomers);

    // Find John Doe in saved customers
    const johnDoe = savedCustomers?.find(
      (c) =>
        c.fullName === "John Doe" ||
        (c.firstName === "John" && c.lastName === "Doe")
    );
    console.log("John Doe in saved customers:", johnDoe);

    // Find John Doe in checked out customers
    const johnDoeCheckedOut = checkedOutCustomers?.find(
      (c) =>
        c.fullName === "John Doe" ||
        (c.firstName === "John" && c.lastName === "Doe")
    );
    console.log("John Doe in checked out customers:", johnDoeCheckedOut);
  };
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'categories', 'status', or 'customers'

  // Handle filter selection
  const handleFilterSelect = (value, type) => {
    if (type === "category") {
      // Update category but keep other filters
      setActiveCategory(value);
    } else if (type === "status") {
      // Update status but keep other filters
      // When clicking 'All Status', only clear the status filter
      setActiveStatus(value);
    } else if (type === "customer") {
      // Update customer but keep other filters
      setActiveCustomer(value);

      // When selecting a customer, automatically set status to OUT
      // since customers can only have checked out items
      if (value !== "") {
        setActiveStatus("OUT");
      }
    } else if (type === "") {
      // Reset all filters when clicking All Items
      setActiveCategory("");
      setActiveStatus("");
      setActiveCustomer("");
    }

    // Always pass the current selection to parent
    // The parent component will decide how to filter based on both values
    setFilter(value);
  };

  // Reset active states when filter changes externally
  useEffect(() => {
    if (filter === "") {
      setActiveCategory("");
      setActiveStatus("");
      setActiveCustomer("");
    } else if (filter === "IN" || filter === "OUT") {
      setActiveStatus(filter);
      setActiveCategory("");
      // Keep customer filter
    } else {
      setActiveCategory(filter);
      // Keep other filters
    }
  }, [filter, setActiveCategory, setActiveStatus, setActiveCustomer]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Filter Inventory</h3>
        <button
          onClick={debugCustomerData}
          className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Debug Customers
        </button>
      </div>
      {/* Filter Tabs */}
      <div className="flex mb-2 border-b overflow-x-auto pb-1 scrollbar-hide">
        <button
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
            activeTab === "all"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => {
            // Reset all filters when clicking All Items tab
            setActiveTab("all");
            setActiveCategory("");
            setActiveStatus("");
            setActiveCustomer("");
            // Use empty type to indicate resetting all filters
            handleFilterSelect("", "");
            console.log("Reset all filters");
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
        <button
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
            activeTab === "customers"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => {
            setActiveTab("customers");
            // When switching to Customers tab, automatically set status to OUT
            // since customers can only have checked out items
            setActiveStatus("OUT");
          }}
        >
          Customers
        </button>
      </div>

      {/* Filter Content */}
      <div className="mt-2 overflow-x-auto pb-2">
        {activeTab === "categories" && (
          <div className="flex flex-wrap gap-2">
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
              <div className="flex items-center gap-2">
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
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors flex items-center justify-center"
                  title="Manage Categories"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </NavLink>
              </div>
            ) : (
              <div className="text-gray-500 mt-2">No categories available</div>
            )}
          </div>
        )}

        {activeTab === "customers" && (
          <div className="mt-4">
            {isLoadingCustomers ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ) : customersError ? (
              <div className="text-red-500 mt-2 p-3 bg-red-50 rounded-md">
                Error loading customers
              </div>
            ) : savedCustomers && savedCustomers.length > 0 ? (
              <div className="flex flex-col gap-2"> 
                <div className="flex flex-wrap gap-2">
                  {savedCustomers.map((customer) => {
                    // Create fullName if it doesn't exist
                    const fullName =
                      customer.fullName ||
                      `${customer.firstName} ${customer.lastName}`.trim();
                    return (
                      <button
                        key={customer.id || customer.email}
                        onClick={() => {
                          handleFilterSelect(fullName, "customer");
                          handleFilterSelect("OUT", "status")
                        }}
                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                          activeCustomer === fullName
                            ? "bg-purple-100 text-purple-800 font-medium shadow-sm"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {fullName}
                        {/* Add a badge for customers with items checked out */}
                        {checkedOutCustomers &&
                          checkedOutCustomers.some(
                            (c) =>
                              c.fullName === fullName ||
                              (c.email && c.email === customer.email)
                          ) && (
                            <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></div>
                            </span>
                          )}
                      </button>
                    );
                  })}
                  {/* Gear icon for managing customers */}
                  <NavLink
                    to="/customers/manage"
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors flex items-center justify-center"
                    title="Manage Customers"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </NavLink>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 mt-2 p-3 bg-gray-50 rounded-md">
                No saved customers found
              </div>
            )}
          </div>
        )}

        {/* Status filters - conditionally visible */}
        <div className="mt-4">
          {/* <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by Status</h4> */}
          <div className="flex flex-wrap gap-2">
            {/* Only show All Status button when not on Customers tab */}
            {activeTab !== "customers" && (
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
            )}

            {/* Only show Items In button when not on Customers tab */}
            {activeTab !== "customers" && (
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
            )}
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
        </div>
      </div>
    </div>
  );
}
