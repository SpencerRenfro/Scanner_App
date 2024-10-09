import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import scan from "../assets/icons/scan.svg";

export default function Example() {
  const location = useLocation();
  let itemManagementSelection = "Item Management";

  // Function to determine if the current path matches the provided path
  const isActive = (path) => location.pathname === path;
  return (
    <div className="navbar w-full h-32 flex items-center bg-slate-100 text-black shadow-xl">
      <div className="flex items-center gap-1 ml-5 grow">
        <img src={scan} width={40} height={20} alt="barcode" />
        <NavLink className="text-center" to="check-in">
          Scanner
        </NavLink>
      </div>
      <div className="justify-center mx-10">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `inline-flex items-center px-1 pt-1 mx-10
              ${isActive ? "opacity-100" : "opacity-50"}`
          }
        >
          Inventory
        </NavLink>
      </div>
      <div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className={`justify-center  mx-10
            ${isActive("/item-management") ? `opacity-100 ${itemManagementSelection = "Item Management"}` 
            : isActive("/add-item") ? `${itemManagementSelection = "Add Item"} opacity-100`
            : isActive("/checkout") ? `${itemManagementSelection = "Check-out"} opacity-100` 
            : isActive("/check-in") ? `${itemManagementSelection = "Scan"} opacity-100`
            : `${itemManagementSelection = "Item Management"} opacity-50`}`}
          >
            {itemManagementSelection}
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-10 w-52 p-2 shadow"
          >
            <li>
              <NavLink to="/item-management">Item Management</NavLink>
            </li>
            <li>
              <NavLink to="/add-item">Add-item</NavLink>
            </li>
            <li>
              <NavLink to="/checkout">Check-out</NavLink>
            </li>
            <li>
              <NavLink to="/check-in">Scan</NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <NavLink
          to="/logs"
          className={({
            isActive,
          }) => `inline-flex items-center px-1 pt-1 mx-10
          ${isActive ? "opacity-100" : "opacity-50"}`}
        >
          Logs
        </NavLink>
      </div>
    </div>
  );
}
