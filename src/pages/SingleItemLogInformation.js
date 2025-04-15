import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
// We're using direct fetch instead of the useFetch hook
import close from "../assets/close.svg";
import dollarSign from "../assets/icons/dollar-sign.svg";

export default function SingleItemLogInformation({ setHideNavbar }) {
  const { id } = useParams();
  const [log, setLog] = useState(null);
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set hideNavbar to true when component mounts
  useEffect(() => {
    if (setHideNavbar) {
      setHideNavbar(true);
    }

    // Cleanup function to reset hideNavbar when component unmounts
    return () => {
      if (setHideNavbar) {
        setHideNavbar(false);
      }
    };
  }, [setHideNavbar]);

  useEffect(() => {
    const fetchLogAndItem = async () => {
      setIsLoading(true);
      try {
        // Fetch the log entry
        const logResponse = await fetch(`http://localhost:8000/itemLogs/${id}`);
        if (!logResponse.ok) {
          throw new Error("Failed to fetch log information");
        }
        const logData = await logResponse.json();
        setLog(logData);

        // Extract item ID from the log's barcode or ID
        const itemId = logData.barcode ? logData.barcode.split("_")[0] : null;

        if (itemId) {
          // Find the item in inventory using the barcode
          const itemResponse = await fetch(
            `http://localhost:8000/inventory?barcode=${itemId}`
          );
          if (!itemResponse.ok) {
            throw new Error("Failed to fetch item information");
          }
          const itemsData = await itemResponse.json();

          if (itemsData.length > 0) {
            setItem(itemsData[0]);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLogAndItem();
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateStr, timeStr) => {
    if (!dateStr) return "Unknown date";
    return `${dateStr} at ${timeStr || "Unknown time"}`;
  };

  // Get status badge color based on action
  const getStatusBadgeClass = (action) => {
    switch (action) {
      case "IN":
        return "bg-green-100 text-green-800";
      case "OUT":
        return "bg-red-100 text-red-800";
      case "CREATED":
        return "bg-indigo-100 text-indigo-800";
      case "UPDATED":
        return "bg-yellow-100 text-yellow-800";
      case "DELETED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 shadow-lg bg-white">
        <h1 className="text-xl font-semibold">Log Information</h1>
        <NavLink
          to="/logs"
          className="hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center"
        >
          <img src={close} width={25} alt="close" />
        </NavLink>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ) : log ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Log Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{log.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(
                    log.action
                  )}`}
                >
                  {log.action}
                </span>
              </div>
              <p className="text-gray-600">
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(log.date, log.time)}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Day:</span>{" "}
                {log.dayOfWeek || "Unknown"}
              </p>
              {log.category && (
                <p className="text-gray-600">
                  <span className="font-semibold">Category:</span>{" "}
                  {log.category}
                </p>
              )}
              {log.barcode && (
                <p className="text-gray-600">
                  <span className="font-semibold">Barcode:</span> {log.barcode}
                </p>
              )}
            </div>

            {/* Item Details (if available) */}
            {item && (
              <div className="p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Item Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">
                      <span className="font-semibold">Name:</span> {item.name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Description:</span>{" "}
                      {item.description || "No description"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Category:</span>{" "}
                      {item.category || "Uncategorized"}
                    </p>
                  </div>
                  <div>
                    <div className="text-gray-600 flex items-center gap-2">
                      <p className={`font-semibold`}>Current Status:</p>
                      {item.status === "IN" ? (
                        <div className="px-2 rounded-xl text-green-600 bg-green-100">IN</div>
                      ) : (
                        <div className="px-2 rounded-xl text-red-600 bg-red-100">OUT</div> || "Unknown"
                      )}
                    </div>
                    <p className="text-gray-600">
                      <span className="font-semibold">Value:</span>
                      <span className="flex items-center">
                        <img
                          src={dollarSign}
                          width={15}
                          alt="dollar sign"
                          className="mr-1"
                        />
                        {item.price || "0.00"}
                      </span>
                    </p>
                    {item.signedOutTo && (
                      <div className="mt-2 p-3 bg-yellow-50 rounded-md">
                        <p className="text-gray-700 font-semibold">
                          Currently signed out to:
                        </p>
                        <p className="text-gray-600">
                          {item.signedOutTo.fullName ||
                            (item.signedOutTo.firstName &&
                            item.signedOutTo.lastName
                              ? `${item.signedOutTo.firstName} ${item.signedOutTo.lastName}`
                              : "Unknown")}
                        </p>
                        {item.signedOutTo.email && (
                          <p className="text-gray-600 text-sm">
                            {item.signedOutTo.email}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <NavLink
                to="/logs"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Logs
              </NavLink>
              {item && (
                <NavLink
                  to={`/inventory/${item.id}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  View Item Details
                </NavLink>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            No log information found for this ID.
          </div>
        )}
      </div>
    </div>
  );
}
