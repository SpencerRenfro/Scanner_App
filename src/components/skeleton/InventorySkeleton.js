import React from 'react'

export default function InventorySkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with title and Add Item button */}
      <div className="flex flex-col sm:flex-row justify-between items-center my-6 sm:my-10">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-4 sm:mb-0"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-28"></div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6">
        {/* Search Bar */}
        <div className="w-full">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        </div>

        {/* Filter */}
        <div className="w-full mt-4">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        </div>

        {/* Stats Section */}
        <div className="col-span-full mt-8">
          <div className="flex flex-wrap gap-4 sm:gap-7">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
          </div>
        </div>

        {/* Table */}
        <div className="col-span-full mt-4 overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="table min-w-full text-black dark:text-white">
              <thead>
                <tr className="text-black dark:text-white items-center border-b-2 border-slate-200 dark:border-gray-700">
                  <th className="font-semibold">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </th>
                  <th className="font-semibold hidden sm:table-cell">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                  </th>
                  <th className="font-semibold hidden md:table-cell">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                  </th>
                  <th className="font-semibold">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </th>
                  <th className="font-semibold hidden md:table-cell">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </th>
                  <th className="font-semibold hidden lg:table-cell">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                  </th>
                  <th className="font-semibold sm:hidden">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {Array(5).fill().map((_, index) => (
                  <tr key={index} className="py-4 border-b-2 border-slate-200 dark:border-gray-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-700">
                    <td className="whitespace-nowrap py-2 sm:py-4">
                      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-36"></div>
                    </td>
                    <td className="hidden md:table-cell">
                      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                    </td>
                    <td>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-14 mb-2 sm:mb-0 sm:mr-2"></div>
                        <div className="hidden sm:block h-5 bg-gray-300 dark:bg-gray-700 rounded w-10"></div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    </td>
                    <td className="hidden lg:table-cell">
                      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                    </td>
                    <td className="sm:hidden">
                      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-8"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
