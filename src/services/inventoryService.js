/**
 * Service for handling inventory operations
 */

const API_URL = 'http://localhost:8000';

/**
 * Import inventory items from data
 * @param {Array} items - Array of inventory items to import
 * @returns {Promise} - Promise that resolves when all items are imported
 */
export const importInventoryItems = async (items) => {
  try {
    // Helper function to clean strings
    function cleanString(value) {
      if (value === undefined || value === null) return '';
      const str = String(value);
      // Remove extra quotes
      return str.replace(/^\"|\"$|^\\"|\\\"$/g, '');
    }

    // Validate and clean items
    const validatedItems = items.map(item => {
      // Create a clean item object
      const cleanItem = {};

      // Generate a random ID if not provided
      cleanItem.id = item.id ? cleanString(item.id) : Math.random().toString(36).substring(2, 6);

      // Clean and map all the fields
      cleanItem.name = cleanString(item.name);
      cleanItem.category = cleanString(item.category);
      cleanItem.price = item.price ? Number(cleanString(item.price)) || 0 : 0;
      cleanItem.serialNumber = cleanString(item.serialNumber);
      cleanItem.description = cleanString(item.description);
      cleanItem.barcode = cleanString(item.barcode);
      cleanItem.barcodeCombinedName = cleanString(item.barcodeCombinedName) ||
        (cleanItem.barcode && cleanItem.name ? `${cleanItem.barcode}_${cleanItem.name}` : '');
      cleanItem.itemCollection = cleanString(item.itemCollection) || '';
      cleanItem.barcodeUrl = cleanString(item.barcodeUrl) || '';
      cleanItem.qrCode = cleanString(item.qrCode) || '';
      cleanItem.status = cleanString(item.status) || 'IN';
      cleanItem.signOutTo = cleanString(item.signOutTo) || '';

      // Add date information
      const now = new Date();
      cleanItem.date = item.date ? cleanString(item.date) : now.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      cleanItem.dayOfWeek = item.dayOfWeek ? cleanString(item.dayOfWeek) : now.toLocaleDateString('en-US', { weekday: 'long' });
      cleanItem.time = item.time ? cleanString(item.time) : now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      // Log the cleaned item for debugging
      console.log('Cleaned item for import:', cleanItem);

      return cleanItem;
    });

    // Import each item
    const importPromises = validatedItems.map(item => {
      return fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to import item: ${item.name}`);
        }
        return response.json();
      });
    });

    // Wait for all imports to complete
    const results = await Promise.all(importPromises);
    return {
      success: true,
      count: results.length,
      items: results
    };
  } catch (error) {
    console.error('Error importing inventory items:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete all inventory items and their associated logs
 * @returns {Promise} - Promise that resolves when all items and their logs are deleted
 */
export const deleteAllInventory = async () => {
  try {
    // First, get all inventory items
    const inventoryResponse = await fetch(`${API_URL}/inventory`);
    if (!inventoryResponse.ok) {
      throw new Error('Failed to fetch inventory items');
    }

    const items = await inventoryResponse.json();

    // Get all logs
    const logsResponse = await fetch(`${API_URL}/itemLogs`);
    if (!logsResponse.ok) {
      throw new Error('Failed to fetch item logs');
    }

    const logs = await logsResponse.json();

    // Delete each inventory item
    const deleteInventoryPromises = items.map(item => {
      return fetch(`${API_URL}/inventory/${item.id}`, {
        method: 'DELETE'
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete item: ${item.name}`);
        }
        return response;
      });
    });

    // Wait for all inventory deletions to complete
    await Promise.all(deleteInventoryPromises);

    // Delete each log one by one using our specialized function
    let logsDeleted = 0;
    for (const log of logs) {
      const result = await deleteLogById(log.id);
      if (result.success) {
        logsDeleted++;
      }
    }

    return {
      success: true,
      count: items.length,
      logsDeleted: logsDeleted
    };
  } catch (error) {
    console.error('Error deleting inventory items:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Export inventory as JSON
 * @returns {Promise} - Promise that resolves with the inventory data
 */
export const exportInventoryAsJson = async () => {
  try {
    const response = await fetch(`${API_URL}/inventory`);
    if (!response.ok) {
      throw new Error('Failed to fetch inventory items');
    }

    const items = await response.json();
    return {
      success: true,
      data: items
    };
  } catch (error) {
    console.error('Error exporting inventory:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Export inventory as CSV
 * @returns {Promise} - Promise that resolves with the inventory data as CSV
 */
export const exportInventoryAsCsv = async () => {
  try {
    const { success, data, error } = await exportInventoryAsJson();

    if (!success) {
      throw new Error(error);
    }

    // Get all possible headers from all items
    const headers = new Set();
    data.forEach(item => {
      Object.keys(item).forEach(key => headers.add(key));
    });

    // Convert headers set to array
    const headerArray = Array.from(headers);

    // Create CSV header row
    let csv = headerArray.join(',') + '\n';

    // Add each item as a row
    data.forEach(item => {
      const row = headerArray.map(header => {
        const value = item[header];

        // Handle arrays and objects
        if (Array.isArray(value)) {
          return `"${value.join(';')}"`;
        } else if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        } else if (typeof value === 'string') {
          // Escape quotes in strings
          return `"${value.replace(/"/g, '""')}"`;
        } else {
          return value !== undefined && value !== null ? value : '';
        }
      }).join(',');

      csv += row + '\n';
    });

    return {
      success: true,
      data: csv
    };
  } catch (error) {
    console.error('Error exporting inventory as CSV:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete a specific log by ID
 * @param {string} logId - The ID of the log to delete
 * @returns {Promise} - Promise that resolves when the log is deleted
 */
export const deleteLogById = async (logId) => {
  try {
    console.log(`Attempting to delete log with ID: ${logId}`);

    // Try multiple approaches to delete the log
    const approaches = [
      // Standard approach with URL encoding
      `${API_URL}/itemLogs/${encodeURIComponent(logId)}`,
      // Alternative encoding for special characters
      `${API_URL}/itemLogs/${logId.replace(/\//g, '%2F').replace(/\s/g, '%20')}`,
      // Raw ID (sometimes works with JSON Server)
      `${API_URL}/itemLogs/${logId}`
    ];

    for (const url of approaches) {
      try {
        console.log(`Trying to delete log using URL: ${url}`);
        const response = await fetch(url, { method: 'DELETE' });

        if (response.ok) {
          console.log(`Successfully deleted log with ID: ${logId}`);
          return { success: true };
        } else {
          console.warn(`Approach failed with status: ${response.status}`);
        }
      } catch (error) {
        console.warn(`Approach failed with error:`, error);
      }
    }

    return {
      success: false,
      error: `Failed to delete log with ID: ${logId} after trying multiple approaches`
    };
  } catch (error) {
    console.error(`Error deleting log with ID: ${logId}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Clean up orphaned logs (logs without corresponding inventory items)
 * @returns {Promise} - Promise that resolves when orphaned logs are deleted
 */
export const cleanupOrphanedLogs = async () => {
  try {
    // Get all inventory items
    const inventoryResponse = await fetch(`${API_URL}/inventory`);
    if (!inventoryResponse.ok) {
      throw new Error('Failed to fetch inventory items');
    }
    const inventoryItems = await inventoryResponse.json();

    // Get all logs
    const logsResponse = await fetch(`${API_URL}/itemLogs`);
    if (!logsResponse.ok) {
      throw new Error('Failed to fetch item logs');
    }
    const logs = await logsResponse.json();

    // Create sets of inventory names and barcodes for quick lookup
    const inventoryNames = new Set(inventoryItems.map(item => item.name));
    const inventoryBarcodes = new Set(inventoryItems.map(item => item.barcode));

    // Find orphaned logs (logs without corresponding inventory items)
    const orphanedLogs = logs.filter(log => {
      // If inventory is empty, all logs are orphaned
      if (inventoryItems.length === 0) {
        return true;
      }

      // Check if log refers to an item that exists in inventory
      const nameExists = log.name && inventoryNames.has(log.name);
      const barcodeExists = log.barcode && inventoryBarcodes.has(log.barcode);

      // If neither name nor barcode exists in inventory, it's an orphaned log
      return !nameExists && !barcodeExists;
    });

    console.log(`Found ${orphanedLogs.length} orphaned logs out of ${logs.length} total logs`);
    console.log('Orphaned logs:', orphanedLogs);

    // Delete each orphaned log one by one using our specialized function
    let deletedCount = 0;
    for (const log of orphanedLogs) {
      const result = await deleteLogById(log.id);
      if (result.success) {
        deletedCount++;
      }
    }

    return {
      success: true,
      count: deletedCount
    };
  } catch (error) {
    console.error('Error cleaning up orphaned logs:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
