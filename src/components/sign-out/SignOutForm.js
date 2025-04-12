import { useState } from 'react';
import savedCustomers from '../../data/savedCustomers';

export default function SignOutForm({url, setCustomerFirstName, setCustomerLastName, setCustomerEmail, setCustomerPhone, handleSignOut}) {
    const [showSavedCustomers, setShowSavedCustomers] = useState(false);

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
            className="btn btn-sm bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => setShowSavedCustomers(!showSavedCustomers)}
          >
            Saved Customers
          </button>

          {showSavedCustomers && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <ul className="py-1">
                {savedCustomers.map(customer => (
                  <li
                    key={customer.id}
                    className="px-4 py-2 hover:bg-indigo-100 cursor-pointer flex flex-col"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <span className="font-medium">{customer.firstName} {customer.lastName}</span>
                    <span className="text-sm text-gray-600">{customer.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="First Name"
          className="input input-bordered w-full my-6"
          onChange={(e) => setCustomerFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="input input-bordered w-full mb-6"
          onChange={(e) => setCustomerLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Email"
          className="input input-bordered w-full mb-6"
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="input input-bordered w-full mb-6"
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
        />
      </div>
      <button className="btn bg-indigo-950 text-white mt-5" type="submit">
        Submit
      </button>
    </form>
  );
}
