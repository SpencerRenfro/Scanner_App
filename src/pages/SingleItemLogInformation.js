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
        // First try direct fetch by ID
        // URL encode the ID to handle special characters
        const encodedId = encodeURIComponent(id);
        let logResponse = await fetch(`http://localhost:8000/itemLogs/${encodedId}`);

        // If that fails, try to get all logs and find the matching one
        if (!logResponse.ok) {
          const allLogsResponse = await fetch(`http://localhost:8000/itemLogs`);

          if (!allLogsResponse.ok) {
            throw new Error("Failed to fetch logs");
          }

          const allLogs = await allLogsResponse.json();

          // Find the log with the matching ID or logId
          const matchingLog = allLogs.find(log => log.id === id || log.logId === id);

          if (matchingLog) {
            // Create a fake response with the matching log
            logResponse = {
              ok: true,
              json: () => Promise.resolve(matchingLog)
            };
          } else {
            throw new Error("Failed to fetch log information - log not found");
          }
        }
        const logData = await logResponse.json();
        setLog(logData);

        // Get the barcode from the log data
        const barcode = logData.barcode;

        if (barcode) {
          // Find the item in inventory using the exact barcode
          const itemResponse = await fetch(
            `http://localhost:8000/inventory?barcode=${barcode}`
          );
          if (!itemResponse.ok) {
            throw new Error("Failed to fetch item information");
          }
          const itemsData = await itemResponse.json();

          if (itemsData.length > 0) {
            setItem(itemsData[0]);
          } else {
            // If no exact match, try to get all inventory and find by barcode
            const allItemsResponse = await fetch(`http://localhost:8000/inventory`);
            if (!allItemsResponse.ok) {
              throw new Error("Failed to fetch all inventory items");
            }
            const allItems = await allItemsResponse.json();

            // Find the item with matching barcode
            const matchedItem = allItems.find(item => item.barcode === barcode);

            if (matchedItem) {
              setItem(matchedItem);
            }
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

  return (
    <div className="bg-slate-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 shadow-lg bg-white dark:bg-gray-800 dark:text-white">
        <h1 className="text-xl font-semibold">Log Information</h1>
        <NavLink
          to="/logs"
          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors flex items-center justify-center"
        >
          <img src={close} width={25} alt="close" className="dark:invert" />
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden dark:text-white">
            {/* Log Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{log.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Item Information</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(log.date, log.time)}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Day:</span>{" "}
                {log.dayOfWeek || "Unknown"}
              </p>
              {log.category && (
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Category:</span>{" "}
                  {log.category}
                </p>
              )}
              {log.barcode && (
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Barcode:</span> {log.barcode}
                </p>
              )}
            </div>

            {/* Log Action Highlight */}
            <div className="px-6 py-4 bg-indigo-50 dark:bg-indigo-900 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Log Entry Details</h3>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Action Type:</span>
                  {/* Force correct action display */}
                  {log.action === "IN" ? (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      IN
                    </span>
                  ) : log.action === "OUT" ? (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                      OUT
                    </span>
                  ) : log.action === "CREATED" ? (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                      CREATED
                    </span>
                  ) : log.action === "DELETED" ? (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                      DELETED
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                      {log.action || "UNKNOWN"}
                    </span>
                  )}
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-sm italic">
                  {log.action === "IN" ? (
                    "This log records when the item was checked back in"
                  ) : log.action === "OUT" ? (
                    "This log records when the item was checked out"
                  ) : log.action === "CREATED" ? (
                    "This log records when the item was first created"
                  ) : log.action === "DELETED" ? (
                    "This log records when the item was deleted"
                  ) : (
                    `This log records an action (${log.action}) performed on the item`
                  )}
                </span>
              </div>
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md text-sm text-blue-800 dark:text-blue-200">
                <p>This is the historical record of a specific action. The item's current status may be different.</p>
              </div>
            </div>

            {/* Item Details (if available) */}
            {item && (
              <div className="p-6 bg-gray-50 dark:bg-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Current Item Details
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  This shows the current state of the item, which may be different from when this log was created
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Name:</span> {item.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Description:</span>{" "}
                      {item.description || "No description"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Category:</span>{" "}
                      {item.category || "Uncategorized"}
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                      <p className="font-semibold text-gray-800 dark:text-white mb-1">Current Item Status:</p>
                      <div className="flex items-center gap-2">
                        {item.status === "IN" ? (
                          <div className="px-3 py-1 rounded-md text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 font-medium">CHECKED IN</div>
                        ) : (
                          <div className="px-3 py-1 rounded-md text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200 font-medium">CHECKED OUT</div>
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          (As of now, not at the time of this log entry)
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Value:</span>
                      <span className="flex items-center">
                        <img
                          src={dollarSign}
                          width={15}
                          alt="dollar sign"
                          className="mr-1 dark:invert"
                        />
                        {item.price || "0.00"}
                      </span>
                    </p>
                    {item.signedOutTo && (
                      <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                        <p className="text-gray-700 dark:text-gray-200 font-semibold">
                          Currently signed out to:
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.signedOutTo.fullName ||
                            (item.signedOutTo.firstName &&
                            item.signedOutTo.lastName
                              ? `${item.signedOutTo.firstName} ${item.signedOutTo.lastName}`
                              : "Unknown")}
                        </p>
                        {item.signedOutTo.email && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
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
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
              <NavLink
                to="/logs"
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
