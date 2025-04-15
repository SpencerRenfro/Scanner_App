import React, { useState } from "react";

//components

//hooks
import { useFindItem } from "../hooks/useFindItem";

function Checkout() {
  const [inputText, setInputText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleScannerSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setDisplayText(inputText);
    setInputText("");
  };

  const { singleItem, isPending, error } = useFindItem(
    displayText,
    isSubmitted
  );
  return (
    <div className="w-full flex justify-center mb-10">
      <div className=" w-1/3 mt-10 pb-20 mx-20 shadow-xl rounded-xl relative border-2">
        <div className="flex">
          <h1 className="col-span-12 text-3xl text-center mt-10 w-full ">
            Sign Item Out
          </h1>
          </div>
        <form className="mx-20">
          <div className="flex flex-col w-full gap-5 items-start">
            <div className="w-full">
              <label>
                <h2 className="font-bold">Date</h2>
              </label>
              {/* <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              /> */}
            </div>
            <div className="w-full">
              <label>
                <h2>First Name</h2>
              </label>
              <input
                className="w-full border-2 rounded-lg p-2"
              />
            </div>
            <div className="w-full">
              <label>
                <h2>Last Name</h2>
              </label>
              <input
                className="w-full border-2 rounded-lg p-2"
              />
            </div>
            <div className="w-full">
              <label>
                <h2>Phone Number</h2>
              </label>
              <input
                className="w-full border-2 rounded-lg p-2"
              />
            </div>
            <div className="w-full">
              <label>
                <h2>Email</h2>
              </label>
              <input
                className="w-full border-2 rounded-lg p-2"
              />
            </div>
            <div>
              <label>
                <h2>Scan Barcode</h2>
                <form onSubmit={handleScannerSubmit} className="w-full">
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleChange}
                    placeholder="Enter barcode"
                    className="w-full rounded-lg mb-3"
                  />
                  <button
                    className="btn mx-5 bg-slate-900 text-white"
                    onClick={handleScannerSubmit}
                  >
                    Search
                  </button>
                  {displayText && <p className="mt-2">You entered: {displayText}</p>}
                </form>
              </label>

              <div>
                {isPending && (
                  <span className="loading loading-bars loading-xs"></span>
                )}
                {error && (
                  <div role="alert" className="my-2 alert alert-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 shrink-0 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {error}
                  </div>
                )}
                {singleItem && (
                  <article className="p-4 border rounded-lg bg-white shadow-sm mt-4">
                    <h3 className="font-bold text-lg">{singleItem.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{singleItem.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="badge badge-outline">{singleItem.category || 'Uncategorized'}</span>
                      <span className={`badge ${singleItem.status === 'IN' ? 'badge-success' : 'badge-error'}`}>
                        {singleItem.status}
                      </span>
                    </div>
                  </article>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
