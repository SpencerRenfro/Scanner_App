import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useStatusWithTimeout } from '../hooks/useStatusWithTimeout';
import { importInventoryItems, importSampleInventoryItems, deleteAllInventory, exportInventoryAsJson, exportInventoryAsCsv, cleanupOrphanedLogs, deleteLogById } from '../services/inventoryService';

// Import icons
import close from '../assets/close.svg';

export default function SystemSettings() {
  // Use custom hook with timeout for status messages (5 seconds)
  const [importStatus, setImportStatus] = useStatusWithTimeout(5000);
  const [exportStatus, setExportStatus] = useStatusWithTimeout(5000);
  const [deleteStatus, setDeleteStatus] = useStatusWithTimeout(5000);
  const [cleanupStatus, setCleanupStatus] = useStatusWithTimeout(5000);
  const [deleteLogStatus, setDeleteLogStatus] = useStatusWithTimeout(5000);

  // Regular state variables
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logIdToDelete, setLogIdToDelete] = useState('');
  const [refreshCounter, setRefreshCounter] = useState(0);
  const fileInputRef = useRef(null);

  // Function to trigger a data refresh
  const refreshData = () => {
    setRefreshCounter(prev => prev + 1);
  };

  // Fetch inventory data, logs data, and customers data
  const { data: inventoryData } = useFetch('http://localhost:8000/inventory', 'GET', refreshCounter);
  const { data: logsData } = useFetch('http://localhost:8000/itemLogs', 'GET', refreshCounter);
  const { data: customersData } = useFetch('http://localhost:8000/customers', 'GET', refreshCounter);

  // Calculate most frequently signed out items
  const getMostFrequentlySignedOutItems = () => {
    if (!logsData) return [];

    // Filter logs to only include sign-out actions
    const signOutLogs = logsData.filter(log => log.action === 'OUT');

    // Count sign-outs by item name
    const signOutCounts = {};
    signOutLogs.forEach(log => {
      const itemName = log.name;
      signOutCounts[itemName] = (signOutCounts[itemName] || 0) + 1;
    });

    // Convert to array and sort by count (descending)
    const sortedItems = Object.entries(signOutCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Return top 5 items
    return sortedItems.slice(0, 5);
  };

  // Get recent sign-out activities
  const getRecentSignOutActivities = () => {
    if (!logsData) return [];

    // Filter logs to only include sign-out actions
    const signOutLogs = logsData.filter(log => log.action === 'OUT');

    // Sort by date and time (most recent first)
    const sortedLogs = [...signOutLogs].sort((a, b) => {
      // Convert date and time to comparable format
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB - dateA; // Descending order (most recent first)
    });

    // Return top 5 most recent sign-outs
    return sortedLogs.slice(0, 5);
  };

  // Get most frequent customers (based on sign-out history)
  const getMostFrequentCustomers = () => {
    if (!logsData || !customersData) return [];

    // Filter logs to only include sign-out actions
    const signOutLogs = logsData.filter(log => log.action === 'OUT');

    // Create a map of customers by ID, email, and full name for easy lookup
    const customerMap = {};
    if (customersData) {
      customersData.forEach(customer => {
        // Use ID as primary key
        if (customer.id) {
          customerMap[customer.id] = customer;
        }

        // Also index by email if available
        if (customer.email) {
          customerMap[customer.email] = customer;
        }

        // Also index by full name if available
        const fullName = customer.fullName ||
          `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
        if (fullName) {
          customerMap[fullName] = customer;
        }
      });
    }

    // Also get customers from inventory items as a fallback
    if (inventoryData) {
      inventoryData.forEach(item => {
        if (item.signedOutTo) {
          const customer = item.signedOutTo;
          const customerId = customer.email ||
            (customer.fullName ||
             `${customer.firstName || ''} ${customer.lastName || ''}`.trim());

          if (customerId && !customerMap[customerId]) {
            customerMap[customerId] = {
              id: customerId,
              name: customer.fullName ||
                    `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
              email: customer.email || 'N/A'
            };
          }
        }
      });
    }

    // Count sign-outs by customer from logs
    const customerCounts = {};

    // For each sign-out log, try to identify the customer
    signOutLogs.forEach(log => {
      // Check if the log has customer information (this would be ideal but might not exist)
      let customerId = null;

      // Try to find the customer by looking at the current inventory state
      if (inventoryData) {
        // Find the item in inventory by barcode or name
        const matchingItem = inventoryData.find(item =>
          (log.barcode && item.barcode === log.barcode) ||
          (log.name && item.name === log.name)
        );

        if (matchingItem && matchingItem.signedOutTo) {
          const customer = matchingItem.signedOutTo;
          customerId = customer.email ||
            (customer.fullName ||
             `${customer.firstName || ''} ${customer.lastName || ''}`.trim());
        }
      }

      // If we found a customer ID
      if (customerId && customerMap[customerId]) {
        const customer = customerMap[customerId];
        const customerKey = customer.id || customer.email || customer.fullName || customerId;

        if (!customerCounts[customerKey]) {
          customerCounts[customerKey] = {
            id: customerKey,
            name: customer.fullName ||
                  `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown',
            email: customer.email || 'N/A',
            count: 0
          };
        }

        customerCounts[customerKey].count++;
      }
    });

    // Convert to array and sort by count (descending)
    const sortedCustomers = Object.values(customerCounts)
      .sort((a, b) => b.count - a.count);

    // Return top 5 customers
    return sortedCustomers.slice(0, 5);
  };

  // Get the most frequently signed out items, recent activities, and frequent customers
  const topSignedOutItems = getMostFrequentlySignedOutItems();
  const recentSignOutActivities = getRecentSignOutActivities();
  const topCustomers = getMostFrequentCustomers();

  // For deleting inventory
  const {
    postData: deleteInventory,
    data: deleteResponse,
    error: deleteError
  } = useFetch('http://localhost:8000/inventory', 'DELETE');

  // Handle importing sample inventory items
  const handleImportSampleItems = async () => {
    try {
      // Show loading status
      setImportStatus({
        success: null,
        message: 'Generating and importing sample inventory items...'
      });

      // Use our service to import sample items (default is 10 items)
      const result = await importSampleInventoryItems(10);

      if (result.success) {
        setImportStatus({
          success: true,
          message: `Successfully imported ${result.count} sample inventory items`
        });

        // Refresh data to update the counts
        refreshData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error importing sample items:', error);
      setImportStatus({
        success: false,
        message: `Error importing sample items: ${error.message}`
      });
    }
  };

  // Handle file import
  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = e => {
      try {
        const content = e.target.result;
        let parsedData;

        // Check if it's JSON or CSV
        if (file.name.endsWith('.json')) {
          parsedData = JSON.parse(content);
          processImportedData(parsedData);
        } else if (file.name.endsWith('.csv')) {
          // Convert CSV to JSON
          parsedData = csvToJson(content);
          processImportedData(parsedData);
        } else {
          setImportStatus({
            success: false,
            message: 'Unsupported file format. Please use JSON or CSV.'
          });
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        setImportStatus({
          success: false,
          message: `Error parsing file: ${error.message}`
        });
      }
    };
    fileReader.onerror = () => {
      setImportStatus({
        success: false,
        message: 'Error reading file'
      });
    };
  };

  // Convert CSV to JSON
  const csvToJson = (csv) => {
    // Split the CSV into lines
    const lines = csv.split('\n');
    const result = [];

    // Parse the header row
    const headers = parseCSVLine(lines[0]);

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = parseCSVLine(lines[i]);
      const obj = {};

      // Map values to headers
      for (let j = 0; j < headers.length; j++) {
        // Remove any extra quotes from the values
        let value = values[j] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        obj[headers[j]] = value;
      }

      result.push(obj);
    }

    return result;
  };

  // Helper function to properly parse CSV lines with quoted values
  const parseCSVLine = (line) => {
    const result = [];
    let inQuotes = false;
    let currentValue = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        // Toggle the inQuotes flag
        inQuotes = !inQuotes;
        // Add the quote to the value
        currentValue += char;
      } else if (char === ',' && !inQuotes) {
        // End of field, add to result and reset currentValue
        result.push(currentValue.trim());
        currentValue = '';
      } else {
        // Add character to the current value
        currentValue += char;
      }
    }

    // Add the last field
    result.push(currentValue.trim());

    return result;
  };

  // Process the imported data
  const processImportedData = async (data) => {
    try {
      // Show loading status
      setImportStatus({
        success: null,
        message: `Importing ${data.length} items...`
      });

      // Use our service to import the data
      const result = await importInventoryItems(data);

      if (result.success) {
        setImportStatus({
          success: true,
          message: `Successfully imported ${result.count} items`
        });

        // Refresh data to update the counts
        refreshData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error processing import:', error);
      setImportStatus({
        success: false,
        message: `Error processing import: ${error.message}`
      });
    }
  };

  // Handle export inventory as JSON
  const handleExportJson = async () => {
    try {
      setExportStatus({
        success: null,
        message: 'Exporting inventory as JSON...'
      });

      const result = await exportInventoryAsJson();

      if (result.success) {
        // Create a blob and download it
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setExportStatus({
          success: true,
          message: `Successfully exported ${result.data.length} items as JSON`
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error exporting inventory as JSON:', error);
      setExportStatus({
        success: false,
        message: `Error exporting inventory: ${error.message}`
      });
    }
  };

  // Handle export inventory as CSV
  const handleExportCsv = async () => {
    try {
      setExportStatus({
        success: null,
        message: 'Exporting inventory as CSV...'
      });

      const result = await exportInventoryAsCsv();

      if (result.success) {
        // Create a blob and download it
        const blob = new Blob([result.data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Count the number of rows (subtract 1 for header)
        const rowCount = result.data.split('\n').length - 2; // -2 for header and trailing newline

        setExportStatus({
          success: true,
          message: `Successfully exported ${rowCount} items as CSV`
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error exporting inventory as CSV:', error);
      setExportStatus({
        success: false,
        message: `Error exporting inventory: ${error.message}`
      });
    }
  };

  // Handle direct log deletion
  const handleDeleteLog = async () => {
    if (!logIdToDelete.trim()) {
      setDeleteLogStatus({
        success: false,
        message: 'Please enter a log ID to delete'
      });
      return;
    }

    try {
      // Show loading status
      setDeleteLogStatus({
        success: null,
        message: `Deleting log with ID: ${logIdToDelete}...`
      });

      // Use our service to delete the log
      const result = await deleteLogById(logIdToDelete);

      if (result.success) {
        setDeleteLogStatus({
          success: true,
          message: `Successfully deleted log with ID: ${logIdToDelete}`
        });
        setLogIdToDelete(''); // Clear the input field
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting log:', error);
      setDeleteLogStatus({
        success: false,
        message: `Error deleting log: ${error.message}`
      });
    }
  };

  // Handle cleanup orphaned logs
  const handleCleanupLogs = async () => {
    try {
      // Show loading status
      setCleanupStatus({
        success: null,
        message: 'Cleaning up orphaned logs...'
      });

      // Use our service to clean up orphaned logs
      const result = await cleanupOrphanedLogs();

      if (result.success) {
        setCleanupStatus({
          success: true,
          message: `Successfully deleted ${result.count} orphaned logs`
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error cleaning up logs:', error);
      setCleanupStatus({
        success: false,
        message: `Error cleaning up logs: ${error.message}`
      });
    }
  };

  // Handle delete inventory
  const handleDeleteInventory = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setDeleteStatus({
        success: false,
        message: 'Please type DELETE to confirm'
      });
      return;
    }

    try {
      // Show loading status
      setDeleteStatus({
        success: null,
        message: 'Deleting all inventory items...'
      });

      // Use our service to delete all inventory items
      const result = await deleteAllInventory();

      if (result.success) {
        setDeleteStatus({
          success: true,
          message: `Successfully deleted ${result.count} inventory items and ${result.logsDeleted} associated logs`
        });
        setShowDeleteModal(false);
        setDeleteConfirmation('');

        // Refresh data to update the counts
        refreshData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting inventory:', error);
      setDeleteStatus({
        success: false,
        message: `Error deleting inventory: ${error.message}`
      });
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-gray-900 min-h-screen dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 shadow-lg bg-slate-100 dark:bg-gray-800 dark:text-white">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">System Settings</h1>
        </div>
        <NavLink
          to="/"
          className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-colors flex items-center justify-center"
        >
          <img src={close} width={24} alt="close" className="dark:invert" />
        </NavLink>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Import Inventory Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Import Inventory</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Import inventory data from a CSV or JSON file. The file should contain columns/fields that match your inventory structure.
            </p>

            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileImport}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
              >
                Select File
              </button>
              <button
                onClick={handleImportSampleItems}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors"
              >
                Import Sample Items
              </button>
            </div>

            {importStatus && (
              <div className={`p-4 rounded relative ${importStatus.success === true ? 'bg-green-100 text-green-800' : importStatus.success === false ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                {importStatus.message}
                {(importStatus.success === true || importStatus.success === false) && (
                  <div className="absolute bottom-0 left-0 h-1 bg-gray-300 animate-shrink" style={{ width: '100%' }}></div>
                )}
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-medium mb-2">File Format Requirements:</h3>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                <li>CSV files should have a header row with column names</li>
                <li>JSON files should contain an array of objects</li>
                <li>Required fields: name, category, barcode</li>
                <li>Optional fields: price, serialNumber, description, status</li>
              </ul>
            </div>
          </div>

          {/* Export Inventory Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Export Inventory</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Export your inventory data as JSON or CSV for backup or analysis purposes.
            </p>

            <div className="flex gap-4 mb-4">
              <button
                onClick={handleExportJson}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
              >
                Export as JSON
              </button>
              <button
                onClick={handleExportCsv}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
              >
                Export as CSV
              </button>
            </div>

            {exportStatus && (
              <div className={`p-4 rounded relative ${exportStatus.success === true ? 'bg-green-100 text-green-800' : exportStatus.success === false ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                {exportStatus.message}
                {(exportStatus.success === true || exportStatus.success === false) && (
                  <div className="absolute bottom-0 left-0 h-1 bg-gray-300 animate-shrink" style={{ width: '100%' }}></div>
                )}
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-medium mb-2">Export Format Information:</h3>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                <li>JSON format preserves all data including nested structures</li>
                <li>CSV format is compatible with Excel and other spreadsheet software</li>
                <li>Exports include all inventory items and their properties</li>
                <li>Use exports as backups before making major changes</li>
              </ul>
            </div>
          </div>

          {/* Delete Inventory Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Delete Entire Inventory</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Warning: This action will permanently delete all inventory items. This cannot be undone.
            </p>

            <div className="mb-4">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors"
              >
                Delete All Inventory
              </button>
            </div>

            {deleteStatus && (
              <div className={`p-4 rounded relative ${deleteStatus.success === true ? 'bg-green-100 text-green-800' : deleteStatus.success === false ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                {deleteStatus.message}
                {(deleteStatus.success === true || deleteStatus.success === false) && (
                  <div className="absolute bottom-0 left-0 h-1 bg-gray-300 animate-shrink" style={{ width: '100%' }}></div>
                )}
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-medium mb-2">Before deleting:</h3>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                <li>Consider exporting your data as a backup</li>
                <li>Ensure all users are aware of this action</li>
                <li>This will delete all items, categories, and related data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Maintenance Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">System Maintenance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cleanup Logs Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Clean Up Orphaned Logs</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Remove log entries that don't have corresponding inventory items. This helps keep your database clean.
              </p>
              <button
                onClick={handleCleanupLogs}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
              >
                Clean Up Logs
              </button>

              {cleanupStatus && (
                <div className={`mt-4 p-4 rounded relative ${cleanupStatus.success === true ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : cleanupStatus.success === false ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                  {cleanupStatus.message}
                  {(cleanupStatus.success === true || cleanupStatus.success === false) && (
                    <div className="absolute bottom-0 left-0 h-1 bg-gray-300 dark:bg-gray-600 animate-shrink" style={{ width: '100%' }}></div>
                  )}
                </div>
              )}
            </div>

            {/* Customer Management Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Customer Management</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Import sample customers to populate your database for testing and demonstration purposes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/import-customers"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors inline-block text-center"
                >
                  Import Sample Customers
                </a>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  Current customers: {customersData ? customersData.length : '...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Statistics */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Inventory Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Total Items</h3>
              <p className="text-3xl font-bold text-indigo-600">{inventoryData ? inventoryData.length : '...'}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Items Checked In</h3>
              <p className="text-3xl font-bold text-green-600">
                {inventoryData ? inventoryData.filter(item => item.status === 'IN').length : '...'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Items Checked Out</h3>
              <p className="text-3xl font-bold text-red-600">
                {inventoryData ? inventoryData.filter(item => item.status === 'OUT').length : '...'}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Items Out For Maintenance</h3>
              <p className="text-3xl font-bold text-amber-600">
                {inventoryData ? inventoryData.filter(item => item.status === 'MAINTENANCE').length : '...'}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Statistics Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Most Frequently Signed Out Items */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Most Frequently Signed Out Items</h2>

            {topSignedOutItems && topSignedOutItems.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Times Signed Out
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {topSignedOutItems.map((item, index) => (
                      <tr key={item.name} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                            {item.count} {item.count === 1 ? 'time' : 'times'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  {logsData ? 'No sign-out data available yet.' : 'Loading sign-out data...'}
                </p>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">About This Data</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This shows which items are signed out most frequently, based on your log history.
                This can help identify high-demand items that might need additional units or special attention.
              </p>
            </div>
          </div>

          {/* Most Frequent Customers */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Most Frequent Customers</h2>

            {topCustomers && topCustomers.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Sign-Outs
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {topCustomers.map((customer, index) => (
                      <tr key={customer.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                            {customer.count} {customer.count === 1 ? 'sign-out' : 'sign-outs'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  {logsData ? 'No sign-out history available yet.' : 'Loading customer data...'}
                </p>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">About This Data</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This shows which customers have signed out items most frequently over time.
                Use this to identify your most active users and manage customer relationships.
              </p>
            </div>
          </div>

          {/* Recent Sign-Out Activities */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Sign-Out Activities</h2>

            {recentSignOutActivities && recentSignOutActivities.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentSignOutActivities.map((log, index) => (
                      <tr key={log.logId || log.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {log.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="text-xs">
                            {log.date} at {log.time}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  {logsData ? 'No recent sign-out activities.' : 'Loading sign-out data...'}
                </p>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">About This Data</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This shows the most recent items that have been signed out.
                Use this to quickly see recent activity in your inventory system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full dark:text-white">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              You are about to delete ALL inventory items. This action cannot be undone.
            </p>
            <p className="mb-4 font-medium">
              Type "DELETE" to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-700 text-black dark:text-white"
              placeholder="Type DELETE here"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInventory}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors"
                disabled={deleteConfirmation !== 'DELETE'}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
