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
  const [filter, setFilter] = useState("");
  const [term, setTerm] = useState(""); // Add state for search term

  // Filtering logs based on filter and search term
  useEffect(() => {
    if (logs) {
      let filtered = logs;

      if (filter !== "") {
        filtered = filtered.filter((item) => item.action === filter);
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
  }, [logs, filter, term]);

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
        <FilterLogs filter={filter} setFilter={setFilter} />
        <div className="col-span-12 -4 h-20">
          <div className="flex gap-7 mt-5">
            <Results itemCount={filteredLogs.length} /> {/* Update based on filtered logs */}
          </div>
        </div>
        {isPending && <div>Loading...</div>}
        {error && <div>{error}</div>}

        {filteredLogs && (
          <div className="col-span-12">
            <Table logs={filteredLogs} filter={filter} />
            <Pagination />
          </div>
        )}
      </div>
    </div>
  );
}
