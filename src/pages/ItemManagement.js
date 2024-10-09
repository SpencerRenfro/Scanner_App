import { NavLink } from "react-router-dom";

export default function ItemManagement() {
  return (
    <div className="flex gap-10 justify-center mt-20">
      <div className="card  w-96 shadow-xl">
        <figure className="px-10 pt-10">
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
            className="rounded-xl"
          />
        </figure>
        <div className="card-body items-center text-center">
        <h2 className="card-title">Add-Item</h2>
        <p>Add a new item to your inventory</p>
          <div className="card-actions">
            <button className="btn btn-primary">
                <NavLink to="/add-item">Add item</NavLink>
            </button>
          </div>
        </div>
      </div>
      <div className="card  w-96 shadow-xl">
        <figure className="px-10 pt-10">
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
            className="rounded-xl"
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">Check-In</h2>
          <p>Return an item back to your inventory</p>
          <div className="card-actions">
            <button className="btn btn-primary"> <NavLink to="/check-in">Check-In</NavLink></button>
          </div>
        </div>
      </div>
      <div className="card w-96 shadow-xl">
        <figure className="px-10 pt-10">
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
            className="rounded-xl"
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">Check-out</h2>
          <p>Sign an item out from your inventory</p>
          <div className="card-actions">
            <button className="btn btn-primary"><NavLink to="/checkout">Check-out</NavLink></button>
          </div>
        </div>
      </div>
    </div>
  );
}
