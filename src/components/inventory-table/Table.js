import { NavLink } from "react-router-dom";
import { useState } from "react";

// Images
import next from "../../assets/icons/next.svg"; // Ensure this path is correct

// Components
import TableHead from "./TableHead";
import CopyableId from "./CopyableId";
import StatusChangeDialog from "../dialogs/StatusChangeDialog";

export default function Table({
  categoryFilter,
  filteredItems,
  onItemUpdated,
  setItemName,
  setItemSignInSuccess,
  setItemSignInFailure,
  setItemSignOutSuccess,
  setItemSignOutFailure
}) {
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogAction, setDialogAction] = useState(null); // 'IN' or 'OUT'

  // Function to handle status change actions
  const confirmStatusChange = (item, newStatus) => {
    // Set the selected item and action for the dialog
    setSelectedItem(item);
    setDialogAction(newStatus);
    setDialogOpen(true);
  };

  // Setup PUT request for updating item status
  const handleStatusChange = async (item, newStatus) => {
    // Prevent multiple clicks
    if (updatingItemId) return;

    setUpdatingItemId(item.id);
    // Set the item name for the banner
    if (setItemName) {
      setItemName(item.name);
    }

    try {
      // Create a log entry for the status change
      if (newStatus === 'IN') {
        // Get current date and time for the log
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
        const timeString = now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

        // Create log entry for the sign-in action
        const logEntry = {
          id: `${item.barcode}_${item.name}`,
          name: item.name,
          action: "IN",
          date: dateString,
          barcode: item.barcode || 'Unknown',
          dayOfWeek: dayOfWeek,
          time: timeString,
          category: item.category || ''
        };

        // Create log entry for sign-in

        // Post the log entry to the itemLogs collection
        const logResponse = await fetch('http://localhost:8000/itemLogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(logEntry)
        });

        if (!logResponse.ok) {
          console.error('Failed to create log entry for sign-in');
        }
      }

      // Update the item status
      const updatedItem = { ...item, status: newStatus };

      // If signing in, clear the customer information
      if (newStatus === 'IN') {
        updatedItem.signedOutTo = null;
        updatedItem.lastUpdated = new Date().toISOString();
      }

      const response = await fetch(`http://localhost:8000/inventory/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem)
      });

      if (!response.ok) {
        throw new Error('Failed to update item status');
      }

      // If successful, notify parent component to refresh data
      if (onItemUpdated) {
        onItemUpdated();
      }

      // Show success banner based on the action
      if (newStatus === 'IN' && setItemSignInSuccess) {
        setItemSignInSuccess(true);
      } else if (newStatus === 'OUT' && setItemSignOutSuccess) {
        setItemSignOutSuccess(true);
      }

    } catch (error) {
      console.error('Error updating item status:', error);

      // Show failure banner based on the action
      if (newStatus === 'IN' && setItemSignInFailure) {
        setItemSignInFailure(true);
      } else if (newStatus === 'OUT' && setItemSignOutFailure) {
        setItemSignOutFailure(true);
      } else {
        // Fallback to alert if banner props aren't available
        alert('Failed to update item status. Please try again.');
      }
    } finally {
      setUpdatingItemId(null);
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="table min-w-full text-black">
        <TableHead />
        <tbody>
          {filteredItems.map((item) =>
            categoryFilter === "" ||
            (categoryFilter === "Uncategorized" && (!item.category || item.category === "")) ||
            item.category === categoryFilter ||
            item.status === categoryFilter ? (
              <tr
                className="py-4 border-b-2 border-slate-200  hover:bg-slate-50"
                key={item.id}
              >
                <td className="whitespace-nowrap py-2 sm:py-4">
                  <NavLink to={`/inventory/${item.id}`} className="hover:text-indigo-700">
                    <p className="font-medium">{item.name}</p>
                  </NavLink>
                </td>
                <td className="hidden sm:table-cell">
                  <p>{item.description.length > 15 ? item.description.slice(0, 15) + '...'
                  : item.description}</p>
                </td>
                <td className="hidden md:table-cell">
                  <p>{item.category ? item.category : "Uncategorized"}</p>
                </td>
                <td>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    {item.status === "IN" ? (
                      <button
                        onClick={() => confirmStatusChange(item, "OUT")}
                        className="badge badge-success badge-outline badge-lg w-14 mb-2 sm:mb-0 sm:mr-2 cursor-pointer hover:bg-green-100 transition-colors flex items-center justify-center"
                        title="Click to sign out"
                      >
                        IN
                      </button>
                    ) : (
                      <button
                        onClick={() => confirmStatusChange(item, "IN")}
                        disabled={updatingItemId === item.id}
                        className="badge badge-error badge-outline badge-lg w-14 mb-2 sm:mb-0 sm:mr-2 cursor-pointer hover:bg-red-100 transition-colors"
                        title="Click to sign in"
                      >
                        {updatingItemId === item.id ? '...' : 'OUT'}
                      </button>
                    )}

                  </div>
                </td>
                <td className="hidden md:table-cell">
                  <p>${item.price}</p>
                </td>
                <td className="hidden lg:table-cell">
                  <CopyableId text={item.barcode} />
                </td>
                <td className="sm:hidden">
                  <details
                    className="dropdown dropdown-end sm:hidden"
                    open={openDropdownId === item.id}
                    onClick={(e) => {
                      // Prevent the default toggle behavior
                      if (e.target.tagName.toLowerCase() === 'summary') {
                        e.preventDefault();
                        // Toggle the dropdown
                        if (openDropdownId === item.id) {
                          setOpenDropdownId(null);
                        } else {
                          setOpenDropdownId(item.id);
                        }
                      }
                    }}
                  >
                    <summary className="btn btn-ghost btn-sm m-1 cursor-pointer flex items-center">
                      <img
                        src={next}
                        alt="chevron"
                        width={20}
                        className="rotate-90"
                      />
                      <span className="ml-2">Options</span>
                    </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-50 w-52 p-2 shadow">

                      {item.status === "OUT" && (
                        <li>
                          <button
                            onClick={() => {
                              setOpenDropdownId(null); // Close dropdown after action
                              confirmStatusChange(item, "IN");
                            }}
                            disabled={updatingItemId === item.id}
                            className="text-left"
                          >
                            {updatingItemId === item.id ? 'Updating...' : 'Sign In'}
                          </button>
                        </li>
                      )}
                      {item.status === "IN" && (
                        <li>
                          <button
                            onClick={() => {
                              setOpenDropdownId(null); // Close dropdown after action
                              confirmStatusChange(item, "OUT");
                            }}
                            className="text-left block w-full py-2"
                          >
                            Sign Out
                          </button>
                        </li>
                      )}
                    </ul>
                  </details>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>

      {/* Status Change Dialog */}
      {dialogOpen && selectedItem && (
        <StatusChangeDialog
          isOpen={dialogOpen}
          onClose={{
            onCancel: () => setDialogOpen(false),
            onConfirm: () => {
              if (dialogAction === 'IN') {
                handleStatusChange(selectedItem, 'IN');
              }
              setDialogOpen(false);
            }
          }}
          item={selectedItem}
          action={dialogAction}
        />
      )}
    </div>
  );
}
