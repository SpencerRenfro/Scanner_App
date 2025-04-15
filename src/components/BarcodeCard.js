import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import bwipjs from "bwip-js";

const BarcodeCard = ({ item }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (item && item.barcode) {
      generateBarcode(item.barcode);
    }
  }, [item]); // Trigger when item changes

  const generateBarcode = (barcodeText) => {
    try {
      bwipjs.toCanvas(canvasRef.current, {
        bcid: "code128", // Barcode type
        text: barcodeText, // Text to encode
        scale: 3, // 3x scaling factor
        height: 10, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: "center", // Text alignment
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (!item) {
    return <div className="text-center p-4">No item data available</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl m-4 transition-all duration-300 hover:shadow-xl">
      <div className="p-6 sm:p-8">
        {/* Item details */}
        {/* Header with status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              {item.description}
            </p>
          </div>
          <div>
            {item.status === "IN" ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 shadow-sm">
                <span className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></span>
                IN
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 shadow-sm">
                <span className="w-2 h-2 mr-1.5 rounded-full bg-red-500"></span>
                OUT
              </span>
            )}
          </div>
        </div>

        {/* Barcode section */}
        <div className="mt-6 flex justify-center">
          <div className="p-4 bg-gray-50 rounded-lg shadow-inner w-full">
            <canvas ref={canvasRef} className="mx-auto" />
            <p className="text-center text-xs text-gray-500 mt-2">
              Item Barcode
            </p>
          </div>
        </div>

        {/* Item details */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Category</p>
            <p className="font-medium text-sm sm:text-base">{item.category}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Price</p>
            <p className="font-medium text-sm sm:text-base">
              ${parseFloat(item.price).toFixed(2)}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">ID</p>
            <p className="font-medium text-sm sm:text-base">{item.id}</p>
          </div>
        </div>

        {/* Action buttons card */}
        <div className="mt-8 overflow-hidden">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg shadow-md p-3">
              <NavLink
                to={`/inventory/${item.id}/edit`}
                className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-indigo-600 text-sm font-medium rounded-md hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Item
              </NavLink>
            </div>

            {item.status === "IN" ? (
              <div className="bg-gray-50 rounded-lg shadow-md p-3">
                <NavLink
                  to={`/${item.id}/sign-out`}
                  className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-amber-600 text-sm font-medium rounded-md hover:bg-amber-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </NavLink>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg shadow-md p-3">
                <NavLink
                  to="/check-in"
                  className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-green-600 text-sm font-medium rounded-md hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In
                </NavLink>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg shadow-md p-3">
            <NavLink
              to={`/inventory/${item.id}/print`}
              className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Barcode
            </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeCard;
