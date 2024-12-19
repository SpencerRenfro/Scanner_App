import { NavLink } from "react-router-dom";

import scan from "../assets/icons/scan.svg";

export default function Example() {
  return (
    <div className="navbar w-full h-32 flex items-center bg-slate-100 text-black shadow-xl">
      <NavLink className="text-center flex items-center gap-1 ml-5 grow" to="/">
        <img src={scan} width={40} height={20} alt="barcode" />
        Scanner
      </NavLink>
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
        <NavLink
          to="/logs"
          className={({ isActive }) => `inline-flex items-center px-1 pt-1 mx-10
          ${isActive ? "opacity-100" : "opacity-50"}`}
        >
          Logs
        </NavLink>
      </div>
    </div>
  );
}
