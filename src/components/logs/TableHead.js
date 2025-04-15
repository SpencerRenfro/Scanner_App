export default function TableHead() {
  return (
    <thead className="bg-slate-100">
      <tr className="text-black items-center border-b-2 border-slate-200 bg-slate-100">
        <th>Name</th>
        <th>Category</th>
        <th>Action</th>
        <th>Action Date</th>
      </tr>
    </thead>
  );
}

