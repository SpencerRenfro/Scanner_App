export default function FilterInventory({ filter, setFilter, categories }) {
  // Handle change event for the select element
  const handleChange = (event) => {
    setFilter(event.target.value);
    console.log('Filter:', event.target.value, 'Type:', typeof event.target.value);

  };

  return (
    <div className="flex items-center">
      <select
        className="select w-full "
        onChange={handleChange} // Use onChange event handler
        value={filter} // Set the value to the current filter
      >
        <option value="" disabled> {/* Empty value for the placeholder option */}
          Filter By
        </option>
        {categories && categories.length > 0 ? (
          categories.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))
        ) : (
          <option value="">No categories available</option> 
        )}
        <option value="IN">Items In</option>
        <option value="OUT">Items Out</option>
        <option value="">Show All</option>
      </select>
    </div>
  );
}


