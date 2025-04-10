import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";

// Images
import next from "../../assets/icons/next.svg"; // Ensure this path is correct

// Components
import TableHead from "./TableHead";

export default function Table({ categoryFilter, filteredItems, onItemUpdated }) {
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // Function to show confirmation dialog
  const confirmStatusChange = (item, newStatus) => {
    const action = newStatus === "IN" ? "sign in" : "sign out";
    const confirmed = window.confirm(`Are you sure you want to ${action} this item?`);

    if (confirmed) {
      handleStatusChange(item, newStatus);
    }
  };

  // Setup PUT request for updating item status
  const handleStatusChange = async (item, newStatus) => {
    // Prevent multiple clicks
    if (updatingItemId) return;

    setUpdatingItemId(item.id);

    try {
      const response = await fetch(`http://localhost:8000/inventory/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update item status');
      }

      // If successful, notify parent component to refresh data
      if (onItemUpdated) {
        onItemUpdated();
      }

    } catch (error) {
      console.error('Error updating item status:', error);
      alert('Failed to update item status. Please try again.');
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
            item.category === categoryFilter ||
            item.status === categoryFilter ? (
              <tr
                className="py-4 border-b-2 border-slate-200 cursor-pointer hover:bg-slate-50"
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
                  <p>{item.category}</p>
                </td>
                <td>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    {item.status === "IN" ? (
                      <button
                        onClick={() => confirmStatusChange(item, "OUT")}
                        disabled={updatingItemId === item.id}
                        className="badge badge-success badge-outline badge-lg w-14 mb-2 sm:mb-0 sm:mr-2 cursor-pointer hover:bg-green-100 transition-colors"
                        title="Click to sign out"
                      >
                        {updatingItemId === item.id ? '...' : 'IN'}
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
                    <div className="hidden sm:block">
                      <NavLink to={`/inventory/${item.id}/edit`} className="hover:text-indigo-700">EDIT</NavLink>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell">
                  <p>${item.price}</p>
                </td>
                <td className="hidden lg:table-cell">
                  <p>{item.barcode}</p>
                </td>
                <td>
                  <details className="dropdown dropdown-end">
                    <summary className="btn btn-ghost btn-sm m-1 cursor-pointer flex items-center">
                      <img
                        src={next}
                        alt="chevron"
                        width={20}
                        className="rotate-90"
                      />
                      <span className="ml-2 hidden sm:inline">Options</span>
                    </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-50 w-52 p-2 shadow">
                      <li>
                        <NavLink to={`/inventory/${item.id}/edit`}>
                          Edit
                        </NavLink>
                      </li>
                      {item.status === "OUT" && (
                        <li>
                          <button
                            onClick={() => confirmStatusChange(item, "IN")}
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
                            onClick={() => confirmStatusChange(item, "OUT")}
                            disabled={updatingItemId === item.id}
                            className="text-left"
                          >
                            {updatingItemId === item.id ? 'Updating...' : 'Sign Out'}
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
    </div>
  );
}
