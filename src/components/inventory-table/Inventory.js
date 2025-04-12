import { useState, useEffect } from "react";

//components
import Results from "./Results";
import CheckedIn from "./CheckedIn";
import CheckedOut from "./CheckedOut";
import TotalAssetValue from "./TotalAssetValue";
import Searchbar from "../Searchbar";
import Table from "./Table";
import FilterInventory from "./FilterInventory";
import Pagination from "../../ui/pagination/Pagination";
import AddItem from "./AddItem";

export default function Inventory({
  inventoryItems,
  categoryItems,
  setItemName,
  setItemSignInSuccess,
  setItemSignInFailure,
  setItemSignOutSuccess,
  setItemSignOutFailure
}) {
  //inventory data states
  const [totalAssetValue, setTotalAssetValue] = useState(0);
  const [checkedIn, setCheckedIn] = useState(0);
  const [checkedOut, setCheckedOut] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  //for changing filter. This uses useState and a function to change the state. This function is passed to the FilterInventory component,
  // and the on change event is handling the value change.
  // "" is the default value for no filter
  const [filter, setFilter] = useState("");

  //searchbar useStates
  const [filteredItems, setFilteredItems] = useState([]);
  const [term, setTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginatedItems, setPaginatedItems] = useState([]);

  // Helper function to update counts and total price
  const updateCounts = (item, counters) => {
    if (!isNaN(parseFloat(item.price))) {
      counters.totalPrice += parseFloat(item.price);
    }
    if (item.status === "IN") {
      counters.checkedIn++;
    } else if (item.status === "OUT") {
      counters.checkedOut++;
    }
  };

  useEffect(() => {
    let counters = {
      totalPrice: 0,
      totalItems: 0,
      checkedIn: 0,
      checkedOut: 0,
    };

    if (filter === "") {
      inventoryItems.forEach((item) => {
        counters.totalItems++;
        updateCounts(item, counters);
      });
    } else if (filter === "IN" || filter === "OUT") {
      let filteredItems = inventoryItems.filter(
        (item) => item.status === filter
      );
      filteredItems.forEach((item) => {
        counters.totalItems++;
        updateCounts(item, counters);
      });
    } else {
      let filteredItems = inventoryItems.filter(
        (item) => item.category === filter
      );
      filteredItems.forEach((item) => {
        counters.totalItems++;
        updateCounts(item, counters);
      });
    }
    setTotalAssetValue(counters.totalPrice);
    setCheckedIn(counters.checkedIn);
    setCheckedOut(counters.checkedOut);
    setItemCount(counters.totalItems);
  }, [inventoryItems, filter]);

  // Handle pagination
  useEffect(() => {
    if (filteredItems.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedItems(filteredItems.slice(startIndex, endIndex));
    } else {
      setPaginatedItems([]);
    }
  }, [filteredItems, currentPage, itemsPerPage]);

  // Function to handle item updates (status changes)
  const handleItemUpdated = () => {
    // This will trigger a re-fetch of the inventory data in the parent component
    // We'll implement this by adding a key to force a re-render
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center my-6 sm:my-10">
        <h1 className="font-bold text-2xl sm:text-3xl mb-4 sm:mb-0">Inventory</h1>
        <AddItem />
      </div>
      <div className="grid grid-cols-1 gap-4 mt-6">
        <div className="w-full">
          <Searchbar inventoryItems={inventoryItems} setTerm={setTerm} term={term} setFilteredItems={setFilteredItems} isInventoryData={true}/>
        </div>
        <div className="w-full mt-4">
          <FilterInventory
            filter={filter}
            setFilter={setFilter}
            categories={categoryItems}
          />
        </div>
        <div className="col-span-full mt-8">
          <div className="flex flex-wrap gap-4 sm:gap-7">
            <Results itemCount={itemCount} />
            <CheckedIn checkedIn={checkedIn} />
            <CheckedOut checkedOut={checkedOut} />
            <TotalAssetValue totalAssetValue={totalAssetValue} />
          </div>
        </div>
        <div className="col-span-full mt-4 overflow-x-auto">
          <Table
            inventoryItems={inventoryItems}
            categoryFilter={filter}
            term={term}
            filteredItems={paginatedItems}
            onItemUpdated={handleItemUpdated}
            setItemName={setItemName}
            setItemSignInSuccess={setItemSignInSuccess}
            setItemSignInFailure={setItemSignInFailure}
            setItemSignOutSuccess={setItemSignOutSuccess}
            setItemSignOutFailure={setItemSignOutFailure}
          />
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalItems={filteredItems.length}
            onPageChange={(page, perPage) => {
              // This will be handled by the useEffect
            }}
          />
        </div>
      </div>
    </div>
  );
}
