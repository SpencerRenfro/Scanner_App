import { NavLink, useParams, useNavigate } from "react-router-dom";

// Images
import next from "../../assets/icons/next.svg"; // Ensure this path is correct

// Components
import TableHead from "./TableHead";

//hooks
import { useFetch } from "../../hooks/useFetch";

export default function Table({
  categoryFilter,
  filteredItems,
  setFilteredItems,
  setItemSignInSuccess,
  setItemSignInFailure,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const url = "http://localhost:8000";
  //PUT Request
  const {
    putData: putItemIn,
    error: putItemInError,
    isPending: putItemInisPending,
  } = useFetch(url, "PUT");

  const handleSignItemIn = async (e, id, item) => {
    e.preventDefault();
    console.log("Signing in item with ID:", id);

    const updatedItem = { ...item, status: "IN" };

    try {
      const response = await fetch(`http://localhost:8000/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error(`Failed to sign in item: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Item signed in successfully:", responseData);
      fetchItems();
    } catch (error) {
      console.error("PUT request failed:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:8000/inventory");
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const data = await response.json();
      setFilteredItems(data);
      setItemSignInSuccess(true);
    } catch (error) {
      console.error("GET request failed:", error);
      setItemSignInFailure(true);
    }
  };
  return (
    <div>
      <table className="table min-w-full text-black">
        <TableHead />
        <tbody>
          {filteredItems.map((item) =>
            categoryFilter === "" ||
            item.category === categoryFilter ||
            item.status === categoryFilter ? (
              <tr
                className="py-4 border-b-2 border-slate-200 cursor-pointer"
                key={item.id}
              >
                <td className="w-1/6">
                  <NavLink to={`/inventory/${item.id}/editItemPage`}>
                    <p>{item.name}</p>
                  </NavLink>
                </td>
                <td className="w-1/6">
                  <p>
                    {item.description.length > 15
                      ? item.description.slice(0, 15) + "..."
                      : item.description}
                  </p>
                </td>
                <td className="w-1/6">
                  <p>{item.category}</p>
                </td>
                <td className="w-1/6">
                  {putItemInError && (
                    <div className="error">{putItemInError}</div>
                  )}
                  {putItemInisPending && (
                    <span className="loading loading-spinner loading-lg"></span>
                  )}

                  <div className="flex">
                    {item.status === "IN" ? (
                      <div className="flex items-center">
                        <div className="badge badge-success badge-outline badge-lg w-14 mr-2">
                          IN
                        </div>
                        <div>
                          <NavLink to={`/${item.id}/sign-out`}>
                            Sign Out
                          </NavLink>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="badge badge-error badge-outline badge-lg w-14 mr-2">
                          OUT
                        </div>
                        <div>
                          <button
                            className="btn btn-sm "
                            onClick={(e) => handleSignItemIn(e, item.id, item)}
                          >
                            Sign In
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="w-1/6">
                  <p>{item.price}</p>
                </td>
                <td className="w-1/6">
                  <NavLink to={`/inventory/${item.id}`}>
                    <p>{item.barcode}</p>
                  </NavLink>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
}
