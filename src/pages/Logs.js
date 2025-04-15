//hooks
import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";

//components
import Searchbar from "../components/Searchbar";
import FilterLogs from "../components/logs/FilterLogs";
import Results from "../components/inventory-table/Results";
import Table from "../components/logs/Table";
import Pagination from "../ui/pagination/Pagination";

export default function LogsTwo() {
  const [filteredLogs, setFilteredLogs] = useState([]); // Store filtered logs here
  const { data: logs, isPending, error } = useFetch('http://localhost:8000/itemLogs');
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [term, setTerm] = useState(""); // Add state for search term

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginatedLogs, setPaginatedLogs] = useState([]);

  // Helper function to parse dates in MM/DD/YYYY format
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [month, day, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  };

  // Filtering and sorting logs based on filter and search term
  useEffect(() => {
    if (logs) {
      let filtered = [...logs]; // Create a copy to avoid mutating the original

      if (statusFilter !== "") {
        filtered = filtered.filter((item) => item.action === statusFilter);
      }

      if (dateFilter !== "") {
        filtered = filtered.filter((item) => {
          // Compare dates regardless of format differences
          return item.date === dateFilter;
        });
      }

      if (term !== "") {
        const lowerCaseTerm = term.toLowerCase();
        filtered = filtered.filter(
          (log) =>
            log.name.toLowerCase().includes(lowerCaseTerm) ||
            log.id.toString().includes(lowerCaseTerm)
        );
      }

      // Sort logs by date and time (newest first)
      filtered.sort((a, b) => {
        // Create combined date-time objects for accurate comparison
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1; // null dates go to the end
        if (!dateB) return -1;

        // If dates are different, sort by date
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB.getTime() - dateA.getTime(); // Newest first
        }

        // If dates are the same, sort by time
        // Convert 12-hour time format to 24-hour for comparison
        const timeA = a.time ? convertTo24Hour(a.time) : '00:00';
        const timeB = b.time ? convertTo24Hour(b.time) : '00:00';

        // Split hours and minutes for numerical comparison
        const [hoursA, minutesA] = timeA.split(':').map(Number);
        const [hoursB, minutesB] = timeB.split(':').map(Number);

        // Compare hours first
        if (hoursB !== hoursA) {
          return hoursB - hoursA; // Newest first
        }

        // If hours are the same, compare minutes
        return minutesB - minutesA; // Newest first
      });

      setFilteredLogs(filtered);
    }
  }, [logs, statusFilter, dateFilter, term]);

  // Helper function to convert 12-hour time format to 24-hour for sorting
  const convertTo24Hour = (time12h) => {
    if (!time12h) return '00:00';

    try {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');

      // Convert to numbers to handle leading zeros properly
      hours = parseInt(hours, 10);

      if (hours === 12) {
        hours = modifier === 'AM' ? 0 : 12;
      } else if (modifier === 'PM') {
        hours += 12;
      }

      // Format with leading zeros
      const formattedHours = hours.toString().padStart(2, '0');

      return `${formattedHours}:${minutes}`;
    } catch (error) {
      console.error('Error parsing time:', time12h, error);
      return '00:00';
    }
  };

  // Handle pagination
  useEffect(() => {
    if (filteredLogs.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedLogs(filteredLogs.slice(startIndex, endIndex));
    } else {
      setPaginatedLogs([]);
    }
  }, [filteredLogs, currentPage, itemsPerPage]);

  return (
    <div className="bg-slate-100 min-h-screen pb-20">
      <div className="grid grid-cols-12 mx-10 lg:mx-40 mt-10">
        <h1 className="col-start-1 col-span-12 font-bold text-3xl text-black my-10">
          Logs
        </h1>
        <div className="col-span-7 mr-10">
          <Searchbar
            isInventoryData={false} // pass false to searchbar for logs, this indicates it's not inventory data
            inventoryItems={filteredLogs} // Pass logs to the searchbar for filtering
            setTerm={setTerm}
            setFilteredItems={setFilteredLogs} // Ensure it updates filtered logs
          />
        </div>
        <FilterLogs
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          logs={logs}
        />
        <div className="col-span-12 -4 h-20">
          <div className="flex gap-7 mt-5">
            <Results itemCount={filteredLogs.length} /> {/* Update based on filtered logs */}
          </div>
        </div>
        {error && (
          <div className="col-span-12 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading Skeletons */}
        {isPending && (
          <div className="col-span-12">
            {/* Desktop Loading Skeleton - Hidden on mobile */}
            <div className="hidden md:block bg-slate-100 animate-pulse">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Table Header Skeleton */}
                <div className="bg-gray-100 px-4 py-3 border-b">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="h-6 bg-gray-200 rounded col-span-1"></div>
                    <div className="h-6 bg-gray-200 rounded col-span-1"></div>
                    <div className="h-6 bg-gray-200 rounded col-span-1"></div>
                    <div className="h-6 bg-gray-200 rounded col-span-1"></div>
                  </div>
                </div>

                {/* Table Rows Skeleton */}
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="border-b px-4 py-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="h-5 bg-gray-200 rounded col-span-1"></div>
                      <div className="h-5 bg-gray-200 rounded col-span-1"></div>
                      <div className="h-5 bg-gray-200 rounded w-24 col-span-1"></div>
                      <div className="h-5 bg-gray-200 rounded col-span-1"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="mt-4 flex justify-between items-center px-4 py-3 bg-white rounded-lg shadow">
                <div className="w-24 h-6 bg-gray-200 rounded"></div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Mobile Loading Skeleton - Hidden on desktop */}
            <div className="md:hidden bg-slate-100 animate-pulse">
              {/* Mobile Cards Skeleton */}
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow mb-4 p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}

              {/* Mobile Pagination Skeleton */}
              <div className="mt-4 flex flex-col space-y-2 bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center">
                  <div className="w-20 h-5 bg-gray-200 rounded"></div>
                  <div className="w-16 h-5 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-center space-x-2 mt-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredLogs && (
          <div className="col-span-12 bg-slate-100">
            <div className="bg-slate-100">
              <Table logs={paginatedLogs} filter={statusFilter} dateFilter={dateFilter} />
              <div className="bg-slate-100">
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalItems={filteredLogs.length}
                  onPageChange={(page, perPage) => {
                    // This will be handled by the useEffect
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
