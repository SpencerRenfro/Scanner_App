import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { importInventoryItems, deleteAllInventory, exportInventoryAsJson, exportInventoryAsCsv } from '../services/inventoryService';

// Import icons
import close from '../assets/close.svg';

export default function SystemSettings() {
  const [importStatus, setImportStatus] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch inventory data
  const { data: inventoryData } = useFetch('http://localhost:8000/inventory', 'GET');

  // For deleting inventory
  const {
    postData: deleteInventory,
    data: deleteResponse,
    error: deleteError
  } = useFetch('http://localhost:8000/inventory', 'DELETE');

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
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',').map(header => header.trim());

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const obj = {};
      const currentLine = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j]?.trim() || '';
      }

      result.push(obj);
    }

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
          message: `Successfully deleted ${result.count} inventory items`
        });
        setShowDeleteModal(false);
        setDeleteConfirmation('');
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

            <div className="mb-4">
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
            </div>

            {importStatus && (
              <div className={`p-4 rounded ${importStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {importStatus.message}
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
              <div className={`p-4 rounded ${exportStatus.success === true ? 'bg-green-100 text-green-800' : exportStatus.success === false ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                {exportStatus.message}
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
              <div className={`p-4 rounded ${deleteStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {deleteStatus.message}
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
              <p className="text-3xl font-bold text-amber-600">
                {inventoryData ? inventoryData.filter(item => item.status === 'OUT').length : '...'}
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
