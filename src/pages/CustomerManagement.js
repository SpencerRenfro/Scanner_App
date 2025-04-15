import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import close from '../assets/close.svg';

// Customer Form component for adding and editing customers
const CustomerForm = ({ customer, onSubmit, onCancel, isEditing }) => {
  const [firstName, setFirstName] = useState(customer?.firstName || '');
  const [lastName, setLastName] = useState(customer?.lastName || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        id: customer?.id,
        firstName,
        lastName,
        email,
        phone,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-6">
      <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {isEditing ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Dialog component for confirming customer deletion
const DeleteConfirmationDialog = ({ isOpen, onClose, customerName, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Dialog */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md z-10 relative">
        <div className="bg-red-600 px-4 py-3">
          <h3 className="text-lg font-medium text-white">Delete Customer</h3>
        </div>

        <div className="p-6">
          <p className="mb-4 text-gray-700">
            Are you sure you want to delete the customer <span className="font-semibold">{customerName}</span>?
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dialog component for showing error when trying to delete a customer with active items
const ErrorDialog = ({ isOpen, onClose, customerName, itemCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Dialog */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md z-10 relative">
        <div className="bg-yellow-500 px-4 py-3">
          <h3 className="text-lg font-medium text-white">Cannot Delete Customer</h3>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-gray-700">
              <span className="font-semibold">{customerName}</span> has {itemCount} active {itemCount === 1 ? 'item' : 'items'} checked out.
            </p>
          </div>
          <p className="text-gray-600 mb-4">
            You cannot delete a customer who has items checked out. Please ensure all items are returned before deleting this customer.
          </p>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeItemsCount, setActiveItemsCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  // Fetch customers and inventory data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch customers
        const customersResponse = await fetch('http://localhost:8000/customers');
        if (!customersResponse.ok) {
          throw new Error('Failed to fetch customers');
        }
        const customersData = await customersResponse.json();

        // Fetch inventory items
        const inventoryResponse = await fetch('http://localhost:8000/inventory');
        if (!inventoryResponse.ok) {
          throw new Error('Failed to fetch inventory');
        }
        const inventoryData = await inventoryResponse.json();

        setCustomers(customersData);
        setInventoryItems(inventoryData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if a customer has active items checked out
  const hasActiveItems = (customer) => {
    if (!customer || !inventoryItems.length) return false;

    // Look for items that are signed out to this customer
    const activeItems = inventoryItems.filter(item =>
      item.status === 'OUT' &&
      item.signedOutTo &&
      ((item.signedOutTo.email && item.signedOutTo.email === customer.email) ||
       (item.signedOutTo.fullName && item.signedOutTo.fullName === `${customer.firstName} ${customer.lastName}`.trim()))
    );

    return activeItems.length > 0 ? activeItems.length : false;
  };

  // Handle initiating customer deletion
  const initiateDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);

    // Check if customer has active items
    const itemCount = hasActiveItems(customer);

    if (itemCount) {
      // If customer has active items, show error dialog
      setActiveItemsCount(itemCount);
      setErrorDialogOpen(true);
    } else {
      // If customer has no active items, show delete confirmation dialog
      setDeleteDialogOpen(true);
    }
  };

  // Handle adding a new customer
  const addCustomer = async (customerData) => {
    try {
      // Generate a unique ID (simple implementation)
      const newCustomer = {
        ...customerData,
        id: Math.random().toString(36).substring(2, 6), // Simple ID generation
      };

      const response = await fetch('http://localhost:8000/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error('Failed to add customer');
      }

      const savedCustomer = await response.json();
      setCustomers([...customers, savedCustomer]);
      setSuccessMessage('Customer added successfully!');
      setShowAddForm(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding customer:', err);
      setError(err.message);
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  // Handle editing an existing customer
  const editCustomer = (customer) => {
    setCustomerToEdit(customer);
    setShowEditForm(true);
  };

  // Handle updating a customer
  const updateCustomer = async (customerData) => {
    try {
      const response = await fetch(`http://localhost:8000/customers/${customerData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      const updatedCustomer = await response.json();
      setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
      setSuccessMessage('Customer updated successfully!');
      setShowEditForm(false);
      setCustomerToEdit(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating customer:', err);
      setError(err.message);
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  // Handle actual customer deletion
  const deleteCustomer = async (id) => {
    try {
      console.log('Deleting customer with ID:', id);

      // Check if the customer exists before trying to delete
      const customerExists = customers.some(customer => customer.id === id);
      if (!customerExists) {
        console.error('Customer not found with ID:', id);
        throw new Error('Customer not found');
      }

      const response = await fetch(`http://localhost:8000/customers/${id}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete failed:', errorText);
        throw new Error(`Failed to delete customer: ${response.status} ${errorText}`);
      }

      setCustomers(customers.filter(customer => customer.id !== id));
      setSuccessMessage('Customer deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError(err.message);
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-6 shadow-lg bg-slate-100">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h1 className="text-xl font-semibold">Manage Customers</h1>
        </div>
        <NavLink
          to="/"
          className="hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center"
        >
          <img src={close} width={24} alt="close" />
        </NavLink>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-700 hover:text-red-900 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Add Customer Form */}
        {showAddForm ? (
          <CustomerForm
            onSubmit={addCustomer}
            onCancel={() => setShowAddForm(false)}
            isEditing={false}
          />
        ) : showEditForm && customerToEdit ? (
          <CustomerForm
            customer={customerToEdit}
            onSubmit={updateCustomer}
            onCancel={() => {
              setShowEditForm(false);
              setCustomerToEdit(null);
            }}
            isEditing={true}
          />
        ) : (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Customer
            </button>
          </div>
        )}

        {/* Customers List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Customers</h2>
          {isLoading ? (
            <div className="py-4 flex justify-center">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ) : customers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => {
                    const itemCount = hasActiveItems(customer);
                    return (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {itemCount ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {itemCount} {itemCount === 1 ? 'item' : 'items'} out
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              No items out
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => editCustomer(customer)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => initiateDeleteCustomer(customer)}
                            className="text-red-600 hover:text-red-900 ml-4"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No customers available.</p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && selectedCustomer && (
        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedCustomer(null);
          }}
          customerName={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
          onConfirm={() => {
            deleteCustomer(selectedCustomer.id);
            setDeleteDialogOpen(false);
            setSelectedCustomer(null);
          }}
        />
      )}

      {/* Error Dialog */}
      {errorDialogOpen && selectedCustomer && (
        <ErrorDialog
          isOpen={errorDialogOpen}
          onClose={() => {
            setErrorDialogOpen(false);
            setSelectedCustomer(null);
          }}
          customerName={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
          itemCount={activeItemsCount}
        />
      )}
    </div>
  );
}
