import React from "react";
import { Link } from "react-router-dom";

import Inventory from "./InventoryPage";

import checkmarkPlain from "../assets/icons/checkmarkPlain.svg";

function ItemCreationSuccessful() {
  return (
    <div className="w-full flex justify-center mt-20 ">
      <div
        className="w-1/4 grid grid-cols-12 justify-items-center dark:bg-slate-700 rounded-lg shadow-xl "
        style={{ height: "600px" }}
      >
        <div className="col-span-12 content-center border w-full bg-green-300">
          <h1 className="font-bold text-center text-white text-2xl">
            Item Creation Successful
          </h1>
        </div>
        <div className="col-span-12 justify-items-center mt-10">
          <img
            src={checkmarkPlain}
            width="175px"
            className="border-green-500 rounded-full bg-green-300 p-5"
            alt="checkmark"
          />
        </div>
        <div className="col-span-12 justify-items-center">
          <div className="grid justify-items-center">
            <Link to="/" element={<Inventory />}>
              <button className="btn w-48">Close</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemCreationSuccessful;
