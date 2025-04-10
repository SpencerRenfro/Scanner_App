import { useState } from 'react';

export default function FilterInventory({ filter, setFilter, categories }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'categories', or 'status'

  // Handle filter selection
  const handleFilterSelect = (value) => {
    setFilter(value);
    console.log('Filter:', value, 'Type:', typeof value);
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filter Inventory</h3>
      {/* Filter Tabs */}
      <div className="flex mb-2 border-b overflow-x-auto pb-1 scrollbar-hide">
        <button
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('all')}
        >
          All Items
        </button>
        <button
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === 'categories' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === 'status' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('status')}
        >
          Status
        </button>
      </div>

      {/* Filter Content */}
      <div className="mt-2 overflow-x-auto pb-2">
        {activeTab === 'all' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterSelect('')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${filter === '' ? 'bg-indigo-100 text-indigo-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Show All
            </button>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterSelect('')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${filter === '' ? 'bg-indigo-100 text-indigo-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Categories
            </button>
            {categories && categories.length > 0 ? (
              categories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleFilterSelect(item.name)}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${filter === item.name ? 'bg-indigo-100 text-indigo-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {item.name}
                </button>
              ))
            ) : (
              <span className="text-xs sm:text-sm text-gray-500 italic">No categories available</span>
            )}
          </div>
        )}

        {activeTab === 'status' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterSelect('')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${filter === '' ? 'bg-indigo-100 text-indigo-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Status
            </button>
            <button
              onClick={() => handleFilterSelect('IN')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${filter === 'IN' ? 'bg-green-100 text-green-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                Items In
              </span>
            </button>
            <button
              onClick={() => handleFilterSelect('OUT')}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${filter === 'OUT' ? 'bg-red-100 text-red-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                Items Out
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


