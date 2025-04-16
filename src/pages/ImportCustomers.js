import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import customersData from '../data/customers_data.json';

const ImportCustomers = () => {
  const [status, setStatus] = useState(null);
  const [importedCount, setImportedCount] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [existingCustomers, setExistingCustomers] = useState([]);

  // Fetch existing customers on component mount
  useEffect(() => {
    const fetchExistingCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8000/customers');
        if (response.ok) {
          const data = await response.json();
          setExistingCustomers(data);
        }
      } catch (error) {
        console.error('Error fetching existing customers:', error);
      }
    };

    fetchExistingCustomers();
  }, []);

  const handleImport = async () => {
    setIsImporting(true);
    setStatus({ type: 'info', message: 'Importing customers...' });

    try {
      // Get existing customer IDs and emails to avoid duplicates
      const existingIds = new Set(existingCustomers.map(c => c.id));
      const existingEmails = new Set(existingCustomers.map(c => c.email).filter(Boolean));

      // Filter out customers that already exist (by ID or email)
      const newCustomers = customersData.filter(customer =>
        !existingIds.has(customer.id) &&
        (!customer.email || !existingEmails.has(customer.email))
      );

      if (newCustomers.length === 0) {
        setStatus({
          type: 'warning',
          message: 'All customers already exist in the database.'
        });
        setIsImporting(false);
        return;
      }

      // Import each new customer
      let successCount = 0;

      for (const customer of newCustomers) {
        const response = await fetch('http://localhost:8000/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(customer)
        });

        if (response.ok) {
          successCount++;
          setImportedCount(prev => prev + 1);
        }
      }

      setStatus({
        type: 'success',
        message: `Successfully imported ${successCount} out of ${newCustomers.length} customers.`
      });
    } catch (error) {
      console.error('Error importing customers:', error);
      setStatus({
        type: 'error',
        message: `Error importing customers: ${error.message}`
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Import Customers</h1>
          <Link
            to="/system-settings"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Settings
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Customer Import Tool</h2>

          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              This tool will import a predefined list of 20 sample customers into your database.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Current customers in database: <span className="font-semibold">{existingCustomers.length}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleImport}
              disabled={isImporting}
              className={`px-4 py-2 rounded-md text-white ${
                isImporting
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800'
              } transition-colors`}
            >
              {isImporting ? 'Importing...' : 'Import Customers'}
            </button>

            <Link
              to="/customers/manage"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
            >
              View All Customers
            </Link>
          </div>

          {status && (
            <div className={`p-4 rounded-md ${
              status.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              status.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              status.type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {status.message}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Customer Preview</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {customersData.slice(0, 5).map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{customer.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{customer.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{customer.company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 italic">
              Showing 5 of {customersData.length} customers. Import to see all.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCustomers;
