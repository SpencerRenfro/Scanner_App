import React, { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';

export default function TestCustomersEndpoint() {
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });
  
  // Fetch all customers
  const { data: customers, error: fetchError } = useFetch('http://localhost:8000/customers', 'GET');
  
  // For adding a new customer
  const { 
    postData: postCustomer, 
    data: postResponse, 
    error: postError 
  } = useFetch('http://localhost:8000/customers', 'POST');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a unique ID
    const id = `c${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Get current date
    const today = new Date().toLocaleDateString();
    
    // Create the full customer object
    const customerData = {
      ...newCustomer,
      id,
      fullName: `${newCustomer.firstName} ${newCustomer.lastName}`,
      createdAt: today,
      lastCheckout: null
    };
    
    // Post the customer data
    postCustomer(customerData);
    
    // Reset the form
    setNewCustomer({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      notes: ''
    });
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Customer Management</h1>
      
      {/* Add Customer Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={newCustomer.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={newCustomer.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={newCustomer.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={newCustomer.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                name="company"
                value={newCustomer.company}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={newCustomer.notes}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Customer
          </button>
          
          {postResponse && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
              Customer added successfully!
            </div>
          )}
          
          {postError && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
              Error: {postError}
            </div>
          )}
        </form>
      </div>
      
      {/* Customer List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Customer List</h2>
        
        {fetchError && (
          <div className="p-3 bg-red-100 text-red-800 rounded mb-4">
            Error loading customers: {fetchError}
          </div>
        )}
        
        {!customers ? (
          <p>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Phone</th>
                  <th className="py-2 px-4 text-left">Company</th>
                  <th className="py-2 px-4 text-left">Last Checkout</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id} className="border-t">
                    <td className="py-2 px-4">{customer.id}</td>
                    <td className="py-2 px-4">{customer.fullName}</td>
                    <td className="py-2 px-4">{customer.email}</td>
                    <td className="py-2 px-4">{customer.phone}</td>
                    <td className="py-2 px-4">{customer.company}</td>
                    <td className="py-2 px-4">{customer.lastCheckout || 'Never'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
