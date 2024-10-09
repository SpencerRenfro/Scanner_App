export default function FilterLogs({ filter, setFilter }) {
  // Handle change event for the select element
  const handleChange = (event) => {
    setFilter(event.target.value);
    console.log('Filter:', event.target.value, 'Type:', typeof event.target.value);
  };

  return (
    <div className="flex items-center">
      <select
        className="select w-full"
        onChange={handleChange}
        value={filter} 
      >
        <option value="" disabled> {/* Placeholder option */}
         Filter By
        </option>
        <option value="CREATED">Created</option>
        <option value="OUT">Out</option>
        <option value="IN">In</option>
        <option value="DELETED">Deleted</option>
        <option value="">Show All</option>
      </select>
    </div>
  );
}
