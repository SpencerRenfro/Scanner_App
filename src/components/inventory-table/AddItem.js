import { NavLink } from "react-router-dom";

//images
// import addIcon from "../../assets/icons/plus.svg"
import plus from "../../assets/icons/plus.svg";

export default function AddItem() {
  return (
    <NavLink to="/add-item" className="block">
      <button className="flex items-center justify-center gap-1 sm:gap-2 bg-indigo-900 text-white hover:bg-indigo-700 rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out shadow-sm">
        <img src={plus} width={16} height={16} alt="add icon" className="w-4 sm:w-5 h-4 sm:h-5" />
        <span>New Item</span>
      </button>
    </NavLink>
  );
}
