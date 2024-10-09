import TableHead from "./TableHead";

function Table({ logs, filter }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-pin-rows table-pin-cols min-w-full text-black">
        <TableHead />
        <tbody className="result">
          {logs.map((item) =>
            filter === "" || item.action === filter ? (
              <tr
                key={`${item.id}-${item.date}-${item.action}`}
                className="items-center py-8 border-b-2 border-slate-200"
              >
                <td className="w-1/4">
                  <p>{item.name}</p>
                </td>
                <td className="w-1/4">
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
                  <p>{item.date}</p>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
