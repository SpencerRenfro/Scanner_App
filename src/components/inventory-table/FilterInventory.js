import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import CustomersPagination from "./CustomersPagination";

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


  const [activeTab, setActiveTab] = useState("all"); // 'all', 'categories', 'status', or 'customers'

  // Pagination for customers and categories
  const [currentCustomersPage, setCurrentCustomersPage] = useState(1);
  const [currentCategoriesPage, setCurrentCategoriesPage] = useState(1);
  const customersPerPage = 10; // Show 10 customers per page
  const categoriesPerPage = 10; // Show 10 categories per page

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
    } else if (filter === "IN" || filter === "OUT" || filter === "MAINTENANCE") {
      setActiveStatus(filter);
      setActiveCategory("");
      // Keep customer filter
    } else {
      setActiveCategory(filter);
      // Keep other filters
    }
  }, [filter, setActiveCategory, setActiveStatus, setActiveCustomer]);

  return (
    <div className="w-full dark:text-white">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Inventory</h3>
      </div>
      {/* Filter Tabs */}
      <div className="flex mb-2 border-b dark:border-gray-700 overflow-x-auto pb-1 scrollbar-hide">
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
            // Reset pagination
            setCurrentCustomersPage(1);
            setCurrentCategoriesPage(1);
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
          onClick={() => {
            setActiveTab("categories");
            // Clear MAINTENANCE status if active when switching to Categories tab
            if (activeStatus === "MAINTENANCE") {
              setActiveStatus("");
            }
            setCurrentCategoriesPage(1); // Reset to page 1 when switching to Categories tab
          }}
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
            // This will override any previous status, including MAINTENANCE
            setActiveStatus("OUT");
            // Reset to page 1 when switching to Customers tab
            setCurrentCustomersPage(1);
          }}
        >
          Customers
        </button>
      </div>

      {/* Filter Content */}
      <div className="mt-2 overflow-x-auto pb-2">
        {activeTab === "categories" && (
          <div className="flex flex-col gap-2">
            {/* Header with category count and gear icon */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {categories ? categories.length + 1 : 1} {(categories ? categories.length + 1 : 1) === 1 ? 'category' : 'categories'} found
              </span>
              <NavLink
                to="/categories/manage"
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors flex items-center justify-center"
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

            {/* Category buttons with pagination */}
            <div className="flex flex-wrap gap-2">
              {/* Always show Uncategorized */}
              <button
                onClick={() => {
                  handleFilterSelect("Uncategorized", "category");
                  setCurrentCategoriesPage(1); // Reset to page 1 when selecting a category
                }}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                  activeCategory === "Uncategorized"
                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 font-medium shadow-sm"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Uncategorized
              </button>

              {categories && categories.length > 0 ? (
                // Show paginated categories
                categories
                  .slice(
                    (currentCategoriesPage - 1) * categoriesPerPage,
                    currentCategoriesPage * categoriesPerPage
                  )
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleFilterSelect(item.name, "category");
                        setCurrentCategoriesPage(1); // Reset to page 1 when selecting a category
                      }}
                      className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                        activeCategory === item.name
                          ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 font-medium shadow-sm"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))
              ) : (
                <div className="text-gray-500 dark:text-gray-400 mt-2">No additional categories available</div>
              )}
            </div>

            {/* Pagination component - only show if we have more than one page */}
            {categories && categories.length > categoriesPerPage && (
              <CustomersPagination
                currentPage={currentCategoriesPage}
                setCurrentPage={setCurrentCategoriesPage}
                customersPerPage={categoriesPerPage}
                totalCustomers={categories.length}
              />
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
                {/* Header with customer count and gear icon */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {checkedOutCustomers ? checkedOutCustomers.length : 0} {(checkedOutCustomers && checkedOutCustomers.length === 1) ? 'customer' : 'customers'} with items checked out
                  </span>
                  <NavLink
                    to="/customers/manage"
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors flex items-center justify-center"
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

                {/* Customer buttons with pagination */}
                <div className="flex flex-wrap gap-2">
                  {/* Filter to only show customers with checked out items */}
                  {savedCustomers
                    .filter(customer => {
                      // Get the customer's full name
                      const fullName = customer.fullName ||
                        `${customer.firstName} ${customer.lastName}`.trim();

                      // Check if this customer has any items checked out
                      return checkedOutCustomers && checkedOutCustomers.some(
                        c => c.fullName === fullName || (c.email && c.email === customer.email)
                      );
                    })
                    .slice(
                      (currentCustomersPage - 1) * customersPerPage,
                      currentCustomersPage * customersPerPage
                    )
                    .map((customer) => {
                      // Create fullName if it doesn't exist
                      const fullName =
                        customer.fullName ||
                        `${customer.firstName} ${customer.lastName}`.trim();
                      return (
                        <button
                          key={customer.id || customer.email}
                          onClick={() => {
                            handleFilterSelect(fullName, "customer");
                            handleFilterSelect("OUT", "status");
                          }}
                          className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                            activeCustomer === fullName
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 font-medium shadow-sm"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {fullName}
                          <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 mr-1"></div>
                          </span>
                        </button>
                      );
                    })}
                </div>

                {/* Pagination component */}
                {/* Only show pagination if there are checked out customers */}
                {checkedOutCustomers && checkedOutCustomers.length > customersPerPage && (
                  <CustomersPagination
                    currentPage={currentCustomersPage}
                    setCurrentPage={setCurrentCustomersPage}
                    customersPerPage={customersPerPage}
                    totalCustomers={checkedOutCustomers.length}
                  />
                )}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                No customers with checked out items
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
                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 font-medium shadow-sm"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium shadow-sm"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 font-medium shadow-sm"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                Items Out
              </span>
            </button>

            {/* Maintenance status button - only show when not on Customers or Categories tab */}
            {activeTab !== "customers" && activeTab !== "categories" && (
              <button
                onClick={() => handleFilterSelect("MAINTENANCE", "status")}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                  activeStatus === "MAINTENANCE"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 font-medium shadow-sm"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
                  MX
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
