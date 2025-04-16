export default function TableHead() {
  return (
    <thead>
      <tr className="text-black dark:text-white items-center border-b-2 border-slate-200 dark:border-gray-700">
        <th className="font-semibold">Name</th>
        <th className="font-semibold hidden sm:table-cell">Description</th>
        <th className="font-semibold hidden md:table-cell">Category</th>
        <th className="font-semibold">Status</th>
        <th className="font-semibold hidden md:table-cell">Value</th>
        <th className="font-semibold hidden lg:table-cell">ID</th>
        <th className="font-semibold sm:hidden">Actions</th>
      </tr>
    </thead>
  );
}
