import React from "react";

function StatisticsModal(props) {
  return (
    <div className="text-3xl w-full border-4 border-red-500">
      <div className="card bg-base-100 w-96 shadow-xl">
      <div className="card-body">
        <div>

        </div>
        <button onClick={props.onClose}>close</button>
      </div>
      </div>
    </div>
  );
}

export default StatisticsModal;
