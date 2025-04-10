import React from 'react'

export default function Results({itemCount}) {
  return (
    <div className='flex items-center text-sm sm:text-base'>
        <span className="font-medium">{itemCount}</span>
        <span className="ml-1">Results</span>
    </div>
  )
}

