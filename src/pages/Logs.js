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

      // Sort logs by date (newest first)
      filtered.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);

        // If dates are the same, sort by time
        if (dateA && dateB && dateA.getTime() === dateB.getTime()) {
          // Convert 12-hour time format to 24-hour for comparison
          const timeA = a.time ? convertTo24Hour(a.time) : '';
          const timeB = b.time ? convertTo24Hour(b.time) : '';
          return timeB.localeCompare(timeA); // Newest first
        }

        // Sort by date if different
        return dateB - dateA; // Newest first
      });

      setFilteredLogs(filtered);
    }
  }, [logs, statusFilter, dateFilter, term]);

  // Helper function to convert 12-hour time format to 24-hour for sorting
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
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
        {isPending && <div>Loading...</div>}
        {error && <div>{error}</div>}

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
