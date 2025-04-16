import TableHead from "./TableHead";
import { NavLink } from "react-router-dom";

function Table({ logs, filter, dateFilter }) {
  return (
    <table className="table min-w-full text-black dark:text-white table-fixed bg-slate-100 dark:bg-gray-800">
      <TableHead />
      <tbody>
        {logs.map((item) =>
          (filter === "" || item.action === filter) &&
          (dateFilter === "" || item.date === dateFilter) ? (
            <tr
              key={`${item.id}-${item.date}-${item.action}`}
              className="py-4 border-b-2 border-slate-200 dark:border-gray-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-700"
            >
              <td className="whitespace-nowrap py-2 sm:py-4">
                <NavLink
                  to={`/logs/${item.id}`}
                  className="hover:text-indigo-700 dark:hover:text-indigo-400"
                >
                  <p className="font-medium">{item.name}</p>
                </NavLink>
              </td>
              <td className="w-1/4">
                <p>{item.category}</p>
              </td>
              <td className="w-1/4">
                <div
                  className={`badge badge-outline badge-lg w-24 ${
                    item.action === "CREATED"
                      ? "badge-info"
                      : item.action === "IN"
                      ? "badge-success"
                      : item.action === "OUT"
                      ? "badge-error"
                      : item.action === "DELETED"
                      ? "badge-warning"
                      : ""
                  }`}
                >
                  {item.action}
                </div>
              </td>
              <td className="w-1/4">
                <p>{`${item.date} at ${item.time}`}</p>
              </td>
            </tr>
          ) : null
        )}
      </tbody>
    </table>
  );
}

export default Table;
