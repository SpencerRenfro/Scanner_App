import { NavLink } from "react-router-dom";

//images
// import addIcon from "../../assets/icons/plus.svg"
import plus from "../../assets/icons/plus.svg";

export default function AddItem() {
  return (
    <NavLink to="/add-item">
      <div className="btn bg-indigo-900 text-white hover:bg-indigo-700 h-14 w-36">
        <img src={plus} width={20}alt="add icon" className="" />
        <p>New Item</p>
      </div>
    </NavLink>
  );
}
