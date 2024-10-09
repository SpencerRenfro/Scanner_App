import React from 'react'

export default function TotalAssetValue({totalAssetValue}) {
  return (
    <div className='flex items-center text-lg'>
        <p>Total Asset Value: ${totalAssetValue}</p>
    </div>
  )
}

