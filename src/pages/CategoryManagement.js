import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import close from '../assets/close.svg';

// Dialog component for confirming category deletion
const DeleteConfirmationDialog = ({ isOpen, onClose, categoryName, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Dialog */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-md z-10 relative">
        <div className="bg-red-600 px-4 py-3">
          <h3 className="text-lg font-medium text-white">Delete Category</h3>
        </div>

        <div className="p-6">
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the category <span className="font-semibold">{categoryName}</span>?
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dialog component for reassigning items
const ReassignDialog = ({ isOpen, onClose, categoryName, categories, onReassign }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Dialog */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-md z-10 relative">
        <div className="bg-indigo-600 px-4 py-3">
          <h3 className="text-lg font-medium text-white">Reassign Items</h3>
        </div>

        <div className="p-6">
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            The category <span className="font-semibold">{categoryName}</span> is currently assigned to one or more items.
            Please select a new category for these items or choose to set them to "Uncategorized".
          </p>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Select a category --</option>
            <option value="Uncategorized">Uncategorized</option>
            {categories.map(category => (
              category.name !== categoryName && (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              )
            ))}
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onReassign(selectedCategory)}
              disabled={!selectedCategory}
              className={`px-4 py-2 rounded-md ${!selectedCategory ? 'bg-indigo-300 dark:bg-indigo-800 cursor-not-allowed' : 'bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800'} text-white transition-colors`}
            >
              Reassign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories and inventory items on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:8000/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch inventory items to check category usage
        const inventoryResponse = await fetch('http://localhost:8000/inventory');
        if (!inventoryResponse.ok) {
          throw new Error('Failed to fetch inventory items');
        }
        const inventoryData = await inventoryResponse.json();
        setInventoryItems(inventoryData);

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const response = await fetch('http://localhost:8000/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.trim(),
          id: Date.now().toString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const addedCategory = await response.json();
      setCategories([...categories, addedCategory]);
      setNewCategory('');
      setSuccessMessage('Category added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Check if a category is in use
  const isCategoryInUse = (categoryName) => {
    return inventoryItems.some(item => item.category === categoryName);
  };

  // Get items using a specific category
  const getItemsUsingCategory = (categoryName) => {
    return inventoryItems.filter(item => item.category === categoryName);
  };

  // Handle initiating category deletion
  const initiateDeleteCategory = (category) => {
    const categoryInUse = isCategoryInUse(category.name);

    if (categoryInUse) {
      // If category is in use, show reassignment dialog
      setSelectedCategory(category);
      setReassignDialogOpen(true);
    } else {
      // If category is not in use, show delete confirmation dialog
      setSelectedCategory(category);
      setDeleteDialogOpen(true);
    }
  };

  // Handle actual category deletion
  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      setCategories(categories.filter(category => category.id !== id));
      setSuccessMessage('Category deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle reassigning items and then deleting the category
  const handleReassignAndDelete = async (newCategoryName) => {
    if (!selectedCategory) return;

    try {
      // Get all items using the category
      const itemsToUpdate = getItemsUsingCategory(selectedCategory.name);

      // Update each item with the new category
      for (const item of itemsToUpdate) {
        const response = await fetch(`http://localhost:8000/inventory/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...item,
            category: newCategoryName === 'Uncategorized' ? '' : newCategoryName
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to update item ${item.name}`);
        }
      }

      // Now delete the category
      await deleteCategory(selectedCategory.id);

      // Update local inventory items to reflect changes
      setInventoryItems(inventoryItems.map(item => {
        if (item.category === selectedCategory.name) {
          return { ...item, category: newCategoryName === 'Uncategorized' ? '' : newCategoryName };
        }
        return item;
      }));

      setSuccessMessage(`Category deleted and ${itemsToUpdate.length} item(s) reassigned successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Close the dialog
      setReassignDialogOpen(false);
      setSelectedCategory(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 shadow-lg bg-white dark:bg-gray-800 dark:text-white">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h1 className="text-xl font-semibold">Manage Categories</h1>
        </div>
        <NavLink
          to="/"
          className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors flex items-center justify-center"
        >
          <img src={close} width={24} alt="close" className="dark:invert" />
        </NavLink>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Add Category Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 dark:text-white">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
            >
              Add Category
            </button>
          </form>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            Error: {error}
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 dark:text-white">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          {isLoading ? (
            <p className="dark:text-gray-300">Loading categories...</p>
          ) : categories.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((category) => (
                <li key={category.id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-800 dark:text-white">{category.name}</span>
                    {isCategoryInUse(category.name) && (
                      <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded-full">
                        In use
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => initiateDeleteCategory(category)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No categories available. Add some categories to get started.</p>
          )}
        </div>
      </div>

      {/* Reassignment Dialog */}
      {reassignDialogOpen && selectedCategory && (
        <ReassignDialog
          isOpen={reassignDialogOpen}
          onClose={() => {
            setReassignDialogOpen(false);
            setSelectedCategory(null);
          }}
          categoryName={selectedCategory.name}
          categories={categories}
          onReassign={handleReassignAndDelete}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && selectedCategory && (
        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedCategory(null);
          }}
          categoryName={selectedCategory.name}
          onConfirm={() => {
            deleteCategory(selectedCategory.id);
            setDeleteDialogOpen(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
}