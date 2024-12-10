import React, { useState, useEffect } from "react";
import BarcodeGenerator from "../components/BarcodeGenerator";
import { useFetch } from "../hooks/useFetch";
import { useBarcodeGenerator } from "../hooks/useBarcodeGenerator";
import { useNavigate, NavLink } from "react-router-dom";
import deleteIcon from "../assets/icons/delete.svg";

//icons
import close from "../assets/close.svg";

export default function AddItem({
  setItemCreationSuccess,
  setItemCreationFailure,
  handleHideNavbar,
}) {
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between p-6 shadow-lg">
        <h1>New Item</h1>
        <button onClick={handleHideNavbar}>
          <NavLink to="/">
            <img src={close} width={25} alt="close" />
          </NavLink>
        </button>
      </div>
      <div className="mx-40 pb-40 grid grid-cols-12 mt-7 gap-4">
        <div className="col-start-4 col-span-6 p-4">
          <h1 className="font-bold">Add New Item</h1>
          <p>Add information about your item</p>
          <input
            type="text"
            placeholder="Item Name"
            className="input input-bordered col-span-5 my-6 py-7 w-full"
            onChange={(e) => {
              console.log("e", e.target);
            }}
            required
          />

          <textarea
            type="text"
            placeholder="Item Description"
            className="input input-bordered col-span-5 my-6  pt-3 w-full min-h-48 max-h-72"
            onChange={(e) => {
              console.log("e", e.target);
            }}
            required
          />

          {!showCustomCategory ? (
            <input
              type="text"
              placeholder="Custom Category"
              className="input input-bordered col-span-5 my-6 py-7 w-full"
              onChange={(e) => {
                console.log("Custom Category Input:", e.target.value);
              }}
              required
            />
          ) : (
            <select
              className="select select-bordered col-span-5 my-6 py-7 w-full"
              onChange={(e) => {
                console.log("Selected Category:", e.target.value);
              }}
              required
            >
              <option value="" disabled selected>
                Select Category
              </option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Furniture">Furniture</option>
              <option value="Books">Books</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          )}

          <div className="flex pl-5 gap-5">
            <input
              type="checkbox"
              defaultChecked
              className="checkbox"
              onClick={() => {
                setShowCustomCategory(!showCustomCategory);
                console.log("showCustomCategory", showCustomCategory);
              }}
            />
            <label className="checkbox-label">Add Custom Category</label>
          </div>
          <input
            type="text"
            placeholder="Item Price"
            className="input input-bordered col-span-5 my-6 py-7 w-full"
            onChange={(e) => {
              console.log("Custom Category Input:", e.target.value);
            }}
            required
          />
          <input
            type="text"
            placeholder="Serial Number"
            className="input input-bordered col-span-5 my-6 py-7 w-full"
            onChange={(e) => {
              console.log("Custom Category Input:", e.target.value);
            }}
            required
          />
          <div className="col-span-4 flex items-center gap-5 my-6">
            <input
              type="text"
              placeholder="Add collection of subitems"
              className="input input-bordered col-span-5 my-6 py-7 w-full"
              onChange={(e) => {
                console.log("Custom Category Input:", e.target.value);
              }}
              required
            />
            <button className="btn">ADD</button>
          </div>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
