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

  // Filtering logs based on filter and search term
  useEffect(() => {
    if (logs) {
      let filtered = logs;

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

      setFilteredLogs(filtered);
    }
  }, [logs, statusFilter, dateFilter, term]);

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
    <div>
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
          <div className="col-span-12">
            <Table logs={paginatedLogs} filter={statusFilter} dateFilter={dateFilter} />
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
        )}
      </div>
    </div>
  );
}
