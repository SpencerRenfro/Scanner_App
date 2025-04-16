import React, { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';

export default function CustomerInventoryView() {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerItems, setCustomerItems] = useState([]);
  
  // Fetch all customers
  const { data: customers, error: customerError } = useFetch('http://localhost:8000/customers', 'GET');
  
  // Fetch all inventory items
  const { data: inventory, error: inventoryError } = useFetch('http://localhost:8000/inventory', 'GET');
  
  // When a customer is selected, filter the inventory to show only their items
  useEffect(() => {
    if (selectedCustomer && inventory) {
      const filteredItems = inventory.filter(item => 
        item.status === 'OUT' && item.signOutTo === selectedCustomer
      );
      setCustomerItems(filteredItems);
    } else {
      setCustomerItems([]);
    }
  }, [selectedCustomer, inventory]);
  
  // Find customer name by ID
  const getCustomerName = (id) => {
    if (!customers) return 'Unknown';
    const customer = customers.find(c => c.id === id);
    return customer ? customer.fullName : 'Unknown';
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Customer Inventory View</h1>
      
      {/* Customer Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Customer
        </label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded"
        >
          <option value="">-- Select a Customer --</option>
          {customers?.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.fullName} ({customer.company})
            </option>
          ))}
        </select>
      </div>
      
      {/* Error Messages */}
      {customerError && (
        <div className="p-4 mb-4 bg-red-100 text-red-800 rounded">
          Error loading customers: {customerError}
        </div>
      )}
      
      {inventoryError && (
        <div className="p-4 mb-4 bg-red-100 text-red-800 rounded">
          Error loading inventory: {inventoryError}
        </div>
      )}
      
      {/* Customer Items */}
      {selectedCustomer && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Items Checked Out to {getCustomerName(selectedCustomer)}
          </h2>
          
          {customerItems.length === 0 ? (
            <p>No items checked out to this customer.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Item Name</th>
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-left">Barcode</th>
                    <th className="py-2 px-4 text-left">Serial Number</th>
                    <th className="py-2 px-4 text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {customerItems.map(item => (
                    <tr key={item.id} className="border-t">
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">{item.category || 'Uncategorized'}</td>
                      <td className="py-2 px-4">{item.barcode}</td>
                      <td className="py-2 px-4">{item.serialNumber || 'N/A'}</td>
                      <td className="py-2 px-4">${item.price || '0'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
