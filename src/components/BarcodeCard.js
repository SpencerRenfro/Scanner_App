import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import bwipjs from 'bwip-js';

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
        bcid: 'code128', // Barcode type
        text: barcodeText, // Text to encode
        scale: 3, // 3x scaling factor
        height: 10, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: 'center', // Text alignment
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
            <p className="text-gray-600 mb-4 text-sm sm:text-base">{item.description}</p>
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
          <div className="p-4 bg-gray-50 rounded-lg shadow-inner w-full max-w-xs">
            <canvas ref={canvasRef} className="mx-auto" />
            <p className="text-center text-xs text-gray-500 mt-2">Item Barcode</p>
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
            <p className="font-medium text-sm sm:text-base">${parseFloat(item.price).toFixed(2)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">ID</p>
            <p className="font-medium text-sm sm:text-base">{item.id}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <NavLink to={`/inventory/${item.id}/edit`} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Edit Item
          </NavLink>
          {item.status === "IN" ? (
            <NavLink to={`/${item.id}/sign-out`} className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
              Sign Out
            </NavLink>
          ) : (
            <NavLink to="/check-in" className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Sign In
            </NavLink>
          )}
          <button onClick={() => window.print()} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Print Barcode
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeCard;
