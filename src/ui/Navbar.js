import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import scan from "../assets/icons/scan.svg";

export default function Example() {
  const location = useLocation();
  let itemManagementSelection = "Item Management";

  // Function to determine if the current path matches the provided path
  const isActive = (path) => location.pathname === path;
  return (
    <div className="navbar w-full h-32 flex items-center bg-slate-100 dark:bg-gray-800 text-black dark:text-white shadow-xl">
      <div className="flex items-center gap-1 ml-5 grow">
        <div className="flex items-center gap-1">
          <NavLink to="/system-settings">
            <img src={scan} width={40} height={20} alt="barcode" className="hover:opacity-70 transition-opacity dark:invert" />
          </NavLink>
          <NavLink className="flex items-center" to="/">
            <span className="text-center">Scanner</span>
          </NavLink>
        </div>
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
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 dark:bg-gray-800 dark:text-white rounded-box z-[1] mt-10 w-52 p-2 shadow"
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
