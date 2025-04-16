import React from 'react'

function Maintenance({maintenance}) {
  return (
    <div className="flex items-center dark:text-white">
      <p className="text-sm sm:text-base mr-2 sm:mr-5">MX</p>
      <svg
        className="w-2 sm:w-3 fill-amber-400 mx-1 sm:mx-2 self-center"
        viewBox="0 0 6 6"
        aria-hidden="true"
      >
        <circle cx={3} cy={3} r={3} />
      </svg>
      <p className="self-center text-sm sm:text-base font-medium">{maintenance}</p>
    </div>
  )
}

export default Maintenance
