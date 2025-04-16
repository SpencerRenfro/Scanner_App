export default function TableHead() {
  return (
    <thead className="bg-slate-100 dark:bg-gray-800">
      <tr className="text-black dark:text-white items-center border-b-2 border-slate-200 dark:border-gray-700 bg-slate-100 dark:bg-gray-800">
        <th>Name</th>
        <th>Category</th>
        <th>Action</th>
        <th>Action Date</th>
      </tr>
    </thead>
  );
}

