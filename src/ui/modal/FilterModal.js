import React, { useEffect, useRef } from "react";

function FilterModal(props) {
  // const handleFilter = (e) => {
  //     console.log(e.target.value);
  // };
  const filterCheckboxRef = useRef(null);
  const filterSelectionRef = useRef(null);
  useEffect(() => {
    if (filterCheckboxRef.current.checked && props.filter !== "") {
      console.log("box is checked and filter is not empty");
      filterCheckboxRef.current.checked = false;
    }
    if (filterCheckboxRef.current.checked) {
      console.log("box is not checked");
      props.setFilter(filterSelectionRef.current.value);
      props.setFilter("");
    }
  }, [
    props.filter,
    props,
    filterCheckboxRef,
    filterSelectionRef,
    props.setFilter,
  ]);
  return (
    <div>
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <div>
            <label className="card-title">
              <h2>Filter Category</h2>
              <select
                onChange={(e) => props.setFilter(e.target.value)}
                ref={filterSelectionRef}
              >
                <option value="Art_Supplies">Art Supplies</option>
                <option value="Education">Education</option>
                <option value="Electronics">Electronics</option>
                <option value="Tools">Tools</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              <h2>No filter</h2>
              <input
                ref={filterCheckboxRef}
                type="checkbox"
                defaultChecked
                className="checkbox"
                value={props.filter}
                onClick={(e) => {
                  if (e.target.checked) {
                    props.setFilter("");
                  } else if (!e.target.checked) {
                    props.setFilter(filterSelectionRef.current.value);
                  }
                }}
              />
              {/* if props.filter = "" then all categories are shown in inventory table */}
            </label>
          </div>
          <div className="w-full flex justify-end">
            <button className="btn border-purple-500" onClick={props.onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
