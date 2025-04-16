import React from 'react'

export default function TotalAssetValue({totalAssetValue}) {
  // Format the total asset value to always show 2 decimal places
  const formattedValue = Number(totalAssetValue).toFixed(2);

  return (
    <div className='flex items-center text-sm sm:text-base md:text-lg dark:text-white'>
        <p>
          <span className="hidden sm:inline">Total Asset Value: </span>
          <span className="sm:hidden">Total: </span>
          <span className="font-medium">${formattedValue}</span>
        </p>
    </div>
  )
}

