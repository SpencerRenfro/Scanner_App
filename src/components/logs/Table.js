import TableHead from "./TableHead";

function Table({ logs, filter }) {
  return (
<table className="table min-w-full text-black table-fixed">
  <TableHead />
  <tbody>
    {logs.map((item) =>
      filter === "" || item.action === filter ? (
        <tr
          key={`${item.id}-${item.date}-${item.action}`}
          className="py-4 border-b-2 border-slate-200 cursor-pointer"
        >
          <td className="w-1/4">
            <p>{item.name}</p>
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
