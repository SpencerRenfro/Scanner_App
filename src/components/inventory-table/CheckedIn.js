import React from "react";

export default function CheckedIn({checkedIn}) {
  return (
    <div className="flex items-center">
      <p className="text-sm sm:text-base mr-2 sm:mr-5">Checked In</p>
      <svg
        className="w-2 sm:w-3 fill-green-400 mx-1 sm:mx-2 self-center"
        viewBox="0 0 6 6"
        aria-hidden="true"
      >
        <circle cx={3} cy={3} r={3} />
      </svg>
      <p className="self-center text-sm sm:text-base font-medium">{checkedIn}</p>
    </div>
  );
}


