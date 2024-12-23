  /*
  Invetory Page Responsible for fetching data from the server and passing it to the Inventory component
  This page fetches Inventory Items, and categories from the server
  change filter is controlled in App.js-- updating to change from its on FIlterInventory.js

  Inventory.js handles the mapping of the fetched data and has many sub functional components each handiling a different aspect of the inventory table
  */

//hooks
import { useContext, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";

//components
import InventorySkeleton from "../components/skeleton/InventorySkeleton";
import Inventory from "../components/inventory-table/Inventory";

//reducers
import { CategoryContext } from "../reducers/CategoryContext";

function InventoryPage({setItemSignInSuccess, setItemSignInFailure, ...props}) {
  const { data, isPending, error } = useFetch(
    "http://localhost:8000/inventory"
  );
  const { data: categories } = useFetch("http://localhost:8000/categories");
  const category = useContext(CategoryContext);


  useEffect(() => {
    if (data) {
      const inventory = [
        {
          Title: "INVENTORY_ITEMS",
          ...data,
        },
        {
          Title: "CATEGORIES",
          categories: data.map((item) => item.category),
          filter: category.categoryFilter,
        },
      ];
      // console.log('inventory:', inventory);
    }
  }, [data, category.categoryFilter]);

  return (
    <div className="bg-slate-100">
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {data && categories && (
        <div>
          <Inventory
            inventoryItems={data}
            categoryItems={categories}
            setShowModal={props.setShowModal}
            modalHandler={props.modalHandler}
            setItemSignInSuccess={setItemSignInSuccess}
            setItemSignInFailure={setItemSignInFailure}
          />
        </div>
      )}
      {!data && !isPending && <InventorySkeleton />}
    </div>
  );
}

export default InventoryPage;
