import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';

export default function SignOutForm({url, setCustomerFirstName, setCustomerLastName, setCustomerEmail, setCustomerPhone, handleSignOut, customerFirstName, customerLastName, customerEmail, customerPhone}) {
    const [showSavedCustomers, setShowSavedCustomers] = useState(false);
    const { data: savedCustomers, isPending, error } = useFetch('http://localhost:8000/customers');

    const handleCustomerSelect = (customer) => {
        setCustomerFirstName(customer.firstName);
        setCustomerLastName(customer.lastName);
        setCustomerEmail(customer.email);
        setCustomerPhone(customer.phone);
        setShowSavedCustomers(false);
    };
    return (
    <form onSubmit={handleSignOut}>
      <div className="flex justify-between items-center mb-4">
        <label>
          <h1 className="font-bold">Customer Information</h1>
        </label>
        <div className="relative">
          <button
            type="button"
            className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
            onClick={() => setShowSavedCustomers(!showSavedCustomers)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Saved Customers
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showSavedCustomers ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>

          {showSavedCustomers && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-xl z-10 border border-gray-200 animate-slideIn">
              <div className="p-3 border-b border-gray-200 bg-indigo-50">
                <h3 className="text-sm font-medium text-indigo-700">Select a Saved Customer</h3>
              </div>
              <ul className="py-1 max-h-60 overflow-y-auto">
                {isPending && (
                  <div className="p-4 text-center">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="p-4 text-center text-red-500">
                    Error loading customers
                  </div>
                )}
                {savedCustomers && savedCustomers.map(customer => (
                  <li
                    key={customer.id}
                    className="px-4 py-3 hover:bg-indigo-50 cursor-pointer flex flex-col border-b border-gray-100 last:border-b-0 transition-colors"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">{customer.firstName} {customer.lastName}</span>
                        <div className="flex flex-col text-xs text-gray-500">
                          <span>{customer.email}</span>
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {savedCustomers && savedCustomers.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No saved customers found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="relative">
          <input
            type="text"
            placeholder="First Name"
            className="input input-bordered w-full my-6"
            onChange={(e) => setCustomerFirstName(e.target.value)}
            value={customerFirstName || ''}
            required
          />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Last Name"
            className="input input-bordered w-full mb-6"
            onChange={(e) => setCustomerLastName(e.target.value)}
            value={customerLastName || ''}
            required
          />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Email"
            className="input input-bordered w-full mb-6"
            onChange={(e) => setCustomerEmail(e.target.value)}
            value={customerEmail || ''}
            required
          />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Phone Number"
            className="input input-bordered w-full mb-6"
            onChange={(e) => setCustomerPhone(e.target.value)}
            value={customerPhone || ''}
            required
          />
        </div>
      </div>
      <button className="btn bg-indigo-950 text-white mt-5" type="submit">
        Submit
      </button>
    </form>
  );
}
