import React from 'react'

export default function InventorySkeleton() {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
    {Array(5).fill().map((_, index) => (
      <tr key={index}>
        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
          <div className="flex items-center">
            <div className="h-11 w-11 flex-shrink-0 bg-gray-300 rounded-full"></div>
            <div className="ml-4">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          <div className="h-4 bg-gray-300 rounded w-36"></div>
        </td>
        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </td>
        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          <div className="h-4 bg-gray-300 rounded w-28"></div>
        </td>
        <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </td>
      </tr>
    ))}
  </tbody>
  )
}
