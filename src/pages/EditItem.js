import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
//custom-hooks
import { useFetch } from "../hooks/useFetch";
//components
import BarcodeGenerator from "../components/BarcodeGenerator";
import ConfirmationDialog from "../components/ConfirmationDialog";
//images
import deleteIcon from "../assets/icons/delete.svg";
import editIcon from "../assets/icons/edit2.svg";
import close from "../assets/close.svg";
import scan from "../assets/icons/scan.svg";

export default function EditItem({
  setItemUpdateFailure,
  setItemUpdateSuccess,
  setItemName,
  setItemDeleteSuccess,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const url = `http://localhost:8000/inventory/${id}`;
  const { data: item, error, isPending } = useFetch(url);

  // PUT Request
  const {
    putData,
    data: putDataResponse,
    error: putError,
    isPending: putIsPending,
  } = useFetch(url, "PUT");

  // DELETE Request
  const {
    deleteData,
    data: deleteDataResponse,
    error: deleteError,
    isPending: deleteIsPending,
  } = useFetch(url, "DELETE");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState(0.0);
  const [collection, setCollection] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [barcodeState, setBarcodeState] = useState("");

  useEffect(() => {
    if (item) {
      // Populate editable fields
      setName(item.name);
      setDescription(item.description);
      setCategory(item.category);
      setStatus(item.status);
      setPrice(item.price);
      setCollection(item.itemCollection || []); // Ensure collection is an array
      setBarcodeState(item.barcode);
    }
  }, [item]);

  useEffect(() => {
    if (putDataResponse) {
      navigate("/");
      setItemUpdateSuccess(true);
      setItemName(name);
    }
  }, [putDataResponse, navigate, setItemUpdateSuccess, setItemName, name]);

  useEffect(() => {
    if (deleteDataResponse) {
      navigate("/");
      if (setItemDeleteSuccess) {
        setItemDeleteSuccess(true);
        setItemName(name);
      }
    }
  }, [deleteDataResponse, navigate, setItemDeleteSuccess, setItemName, name]);

  const deleteCollectionItem = (index) => {
    setCollection(collection.filter((_, i) => i !== index));
  };

  const editCollectionItem = (index) => {
    // Get the item to be edited
    const itemToEdit = collection[index];

    // Ask for new value
    const newValue = prompt("Edit item:", itemToEdit);

    if (newValue !== null && newValue !== "") {
      // Create a new array with the updated value
      const updatedCollection = collection.map((item, i) =>
        i === index ? newValue : item
      );

      // Update the state with the modified collection
      setCollection(updatedCollection);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the updated item data, keeping other fields intact
    const updatedItem = {
      ...item, // Copy all other fields from the original item
      name, // Overwrite the fields that are modifiable
      description,
      category,
      status,
      price,
      itemCollection: collection, // Update the itemCollection field
    };

    // Send PUT request with updated item data
    putData(updatedItem);

    if (putError) {
      console.log("Error updating item:", putError);
    }
  };

  return (
    <div>
      <div className="w-full">
        <div className="flex items-center justify-between p-6 shadow-lg bg-slate-100 dark:bg-gray-800 dark:text-white">
          <div className="flex items-center gap-3">
            <img
              src={scan}
              width={28}
              height={28}
              alt="barcode"
              className="opacity-80 dark:invert"
            />
            <h1 className="text-xl font-semibold">
              {item ? item.name : "Item Details"}
            </h1>
          </div>
          <NavLink
            to="/"
            className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors flex items-center justify-center"
          >
            <img src={close} width={24} alt="close" className="dark:invert" />
          </NavLink>
        </div>
      </div>
      <div className="flex justify-center">
        {error && <div className="error">{error}</div>}
        {isPending && (
          <span className="loading loading-spinner loading-lg"></span>
        )}
        {putIsPending ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          item && (
            <form onSubmit={handleSubmit} className="w-1/3 mt-10 pb-10">
              <div className="card border shadow-lg ">
                <div className="card-body ">
                  <div className="form-group">
                    <label className="font-bold">Name:</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input input-bordered w-full bg-inherit"
                      required
                    />
                  </div>
                  <div className="form-group mt-4">
                    <label className="font-bold">Description:</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="textarea textarea-bordered w-full bg-inherit max-h-72"
                      required
                    />
                  </div>
                  <div className="form-group mt-4">
                    <label className="font-bold">Category:</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input input-bordered w-full bg-inherit"
                      required
                    />
                  </div>
                  <div className="form-group mt-4">
                    <label className="font-bold">Price:</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="input input-bordered w-full bg-inherit"
                      required
                    />
                  </div>
                  <div className="form-group mt-4">
                    <label className="font-bold">Collections:</label>
                    <ul>
                      {collection.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span>{item}</span>
                          <button
                            type="button"
                            className="ml-4 text-red-600"
                            onClick={() => deleteCollectionItem(index)}
                          >
                            <img src={deleteIcon} alt="Delete" />
                          </button>
                          <button
                            type="button"
                            className="ml-4 text-blue-600"
                            onClick={() => editCollectionItem(index)}
                          >
                            <img src={editIcon} width={25} alt="Edit" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="form-group mt-4">
                    <label className="font-bold">Status:</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="select select-bordered w-full bg-inherit"
                      required
                    >
                      <option value="IN">IN</option>
                      <option value="OUT">OUT</option>
                      <option value="MAINTENANCE">MX</option>
                    </select>
                  </div>
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      type="submit"
                      className="btn btn-outline flex"
                      disabled={putIsPending || deleteIsPending}
                    >
                      Update Item
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-error flex"
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={putIsPending || deleteIsPending}
                    >
                      Delete Item
                    </button>
                  </div>
                </div>
                <div className="flex justify-center my-2 mb-5">
                  <BarcodeGenerator barcodeState={barcodeState} />
                </div>
              </div>
            </form>
          )
        )}
        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          title="Delete Item"
          message={`Are you sure you want to delete ${name}? This action cannot be undone.`}
          onConfirm={async () => {
            try {
              // Get current date and time for the log
              const now = new Date();
              const dateString = now.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              });
              const timeString = now.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });
              const dayOfWeek = now.toLocaleDateString("en-US", {
                weekday: "long",
              });

              // Create a unique timestamp for the log ID
              const timestamp = now.getTime();

              // Create log entry for the delete action with a unique ID
              const logEntry = {
                id: `${item.barcode}_${name}_DELETED_${timestamp}`,
                logId: `log_${timestamp}`,
                name: name,
                action: "DELETED",
                date: dateString,
                barcode: item.barcode || "Unknown",
                dayOfWeek: dayOfWeek,
                time: timeString,
                category: category || "",
              };

              console.log("Creating delete log entry:", logEntry);

              // Post the log entry to the itemLogs collection
              const logResponse = await fetch(
                "http://localhost:8000/itemLogs",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(logEntry),
                }
              );

              if (!logResponse.ok) {
                console.error("Failed to create log entry for delete");
              }

              // Fetch all logs for this item
              const logsResponse = await fetch("http://localhost:8000/itemLogs");
              if (!logsResponse.ok) {
                console.error("Failed to fetch item logs");
              } else {
                const logs = await logsResponse.json();

                // Filter logs related to this item (by name and barcode)
                const itemLogs = logs.filter(log =>
                  (log.name === name) ||
                  (item.barcode && log.barcode === item.barcode)
                );

                console.log(`Found ${itemLogs.length} logs for item ${name}`);

                // Delete each log for this item
                for (const log of itemLogs) {
                  try {
                    const deleteLogResponse = await fetch(`http://localhost:8000/itemLogs/${log.id}`, {
                      method: "DELETE"
                    });

                    if (!deleteLogResponse.ok) {
                      console.warn(`Failed to delete log: ${log.id}`);
                    }
                  } catch (logError) {
                    console.error(`Error deleting log ${log.id}:`, logError);
                  }
                }
              }

              // Delete the item
              deleteData();

              if (deleteError) {
                console.log("Error deleting item:", deleteError);
              }
            } catch (error) {
              console.error("Error in delete process:", error);
            }
          }}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div>
    </div>
  );
}
