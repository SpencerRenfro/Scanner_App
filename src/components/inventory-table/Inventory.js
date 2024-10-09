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

export default function Inventory({ inventoryItems, categoryItems }) {
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

  return (
    <div>
      {/* <h1 className="col-start-1 col-span-12 font-bold text-3xl text-black my-10"> */}
      <div className="flex flex-grow justify-between my-10 mx-40">
        <h1 className="font-bold text-3xl">Inventory</h1>
        <AddItem />
      </div>
      <div className="grid grid-cols-12 mx-40 mt-10">
        <div className="col-span-7 mr-10">
          <Searchbar inventoryItems={inventoryItems} setTerm={setTerm} term={term} setFilteredItems={setFilteredItems} />
        </div>
        <FilterInventory
          filter={filter}
          setFilter={setFilter}
          categories={categoryItems}
        />
        <div className="col-span-12 h-20">
          <div className="flex gap-7">
            <Results itemCount={itemCount} />
            <CheckedIn checkedIn={checkedIn} />
            <CheckedOut checkedOut={checkedOut} />
            <TotalAssetValue totalAssetValue={totalAssetValue} />
          </div>
        </div>
        <div className="col-span-12">
          <Table
            inventoryItems={inventoryItems}
            categoryFilter={filter}
            term={term}
            filteredItems={filteredItems}
          />
          <Pagination />
        </div>
      </div>
    </div>
  );
}
