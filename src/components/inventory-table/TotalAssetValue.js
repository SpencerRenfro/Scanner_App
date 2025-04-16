import React from 'react'

export default function TotalAssetValue({totalAssetValue}) {
  return (
    <div className='flex items-center text-sm sm:text-base md:text-lg dark:text-white'>
        <p>
          <span className="hidden sm:inline">Total Asset Value: </span>
          <span className="sm:hidden">Total: </span>
          <span className="font-medium">${totalAssetValue}</span>
        </p>
    </div>
  )
}

