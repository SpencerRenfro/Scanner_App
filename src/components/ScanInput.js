import React, { useState } from "react";

function ScanInput(props) {
  return (
    <form onSubmit={props.handleSubmit} className="w-full">
      <input
        type="text"
        value={props.inputText}
        onChange={props.handleChange}
        placeholder="Enter text"
        className="w-full rounded-lg mb-3"
      />
      <button
        className="btn mx-5 bg-slate-900 text-white"
        onClick={props.handleSubmit}
      >
        Search
      </button>
      <div className="display-text">
        {props.isplayText && <p>You entered: {props.displayText}</p>}
      </div>
    </form>
  );
}

export default ScanInput;
