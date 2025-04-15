import { useState, useEffect } from 'react';

export default function FilterInventory({
  filter,
  setFilter,
  categories,
  activeCategory,
  setActiveCategory,
  activeStatus,
  setActiveStatus
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'categories', or 'status'

  // Handle filter selection
  const handleFilterSelect = (value, type) => {
    if (type === 'category') {
      // Update category but keep status
      setActiveCategory(value);
    } else if (type === 'status') {
      // Update status but keep category
      setActiveStatus(value);
    } else if (type === '') {
      // Reset both when clicking All Items
      setActiveCategory('');
      setActiveStatus('');
    }

    // Always pass the current selection to parent
    // The parent component will decide how to filter based on both values
    setFilter(value);
    console.log('Filter:', value, 'Type:', typeof value, 'Category:', activeCategory, 'Status:', activeStatus);
  };

  // Reset active states when filter changes externally
  useEffect(() => {
    if (filter === '') {
      setActiveCategory('');
      setActiveStatus('');
    } else if (filter === 'IN' || filter === 'OUT') {
      setActiveStatus(filter);
      setActiveCategory('');
    } else {
      setActiveCategory(filter);
 
    }
  }, [filter, setActiveCategory, setActiveStatus]);

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filter Inventory</h3>
      {/* Filter Tabs */}
      <div className="flex mb-2 border-b overflow-x-auto pb-1 scrollbar-hide">
        <button
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => {
            setActiveTab('all');
            setActiveCategory('');
            setActiveStatus('');
            handleFilterSelect('', '');
          }}
        >
          All Items
        </button>
        <button
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === 'categories' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>

      </div>

      {/* Filter Content */}
      <div className="mt-2 overflow-x-auto pb-2">

        {activeTab === 'all' && (
          <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterSelect('', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === '' ? 'bg-indigo-100 text-indigo-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All Status
          </button>
          <button
            onClick={() => handleFilterSelect('IN', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === 'IN' ? 'bg-green-100 text-green-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              Items In
            </span>
          </button>
          <button
            onClick={() => handleFilterSelect('OUT', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === 'OUT' ? 'bg-red-100 text-red-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
              Items Out
            </span>
          </button>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="flex flex-wrap gap-2">

            <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterSelect('', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === '' ? 'bg-indigo-100 text-indigo-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All Status
          </button>
          <button
            onClick={() => handleFilterSelect('IN', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === 'IN' ? 'bg-green-100 text-green-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              Items In
            </span>
          </button>
          <button
            onClick={() => handleFilterSelect('OUT', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === 'OUT' ? 'bg-red-100 text-red-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
              Items Out
            </span>
          </button>
          </div>
            {categories && categories.length > 0 ? (
              categories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleFilterSelect(item.name, 'category')}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeCategory === item.name ? 'bg-indigo-100 text-indigo-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {item.name}
                </button>
              ))
            ) : (
              <span className="text-xs sm:text-sm text-gray-500 italic">No categories available</span>
            )}
          </div>
        )}

        {/* Status filters - always visible */}
        <div className="mt-4">
          {/* <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by Status</h4> */}
          {/* <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterSelect('', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === '' ? 'bg-indigo-100 text-indigo-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All Status
          </button>
          <button
            onClick={() => handleFilterSelect('IN', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === 'IN' ? 'bg-green-100 text-green-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              Items In
            </span>
          </button>
          <button
            onClick={() => handleFilterSelect('OUT', 'status')}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors ${activeStatus === 'OUT' ? 'bg-red-100 text-red-800 font-medium shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
              Items Out
            </span>
          </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}