import { NavLink } from "react-router-dom";

// Images
import next from "../../assets/icons/next.svg"; // Ensure this path is correct

// Components
import TableHead from "./TableHead";

export default function Table({ categoryFilter, filteredItems }) {
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
                  <NavLink to={`/inventory/${item.id}`}>
                    <p>{item.name}</p>
                  </NavLink>
                </td>
                <td className="w-1/6">
                  <p>{item.description}</p>
                </td>
                <td className="w-1/6">
                  <p>{item.category}</p>
                </td>
                <td className="w-1/6">
                  {item.status === "IN" ? (
                    <div className="badge badge-success badge-outline badge-lg w-14">
                      IN
                    </div>
                  ) : (
                    <div className="badge badge-error badge-outline badge-lg w-14">
                      OUT
                    </div>
                  )}
                </td>
                <td className="w-1/6">
                  <p>{item.price}</p>
                </td>
                <td className="w-1/6">
                  <p>{item.barcode}</p>
                </td>
                <td className="w-1/6">
                  <details className="dropdown">
                    <summary className="btn btn-ghost m-1 cursor-pointer flex items-center">
                      <img
                        src={next}
                        alt="chevron"
                        width={25}
                        className="rotate-90"
                      />
                      <span className="ml-2">Options</span>{" "}
                    </summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-50 w-52 p-2 shadow">
                      <li>
                        <NavLink to={`/inventory/${item.id}/edit`}>Edit</NavLink>
                      </li>
                      <li>Sign In</li>
                      <NavLink to={`/${item.id}/sign-out`}>Sign Out</NavLink>
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
