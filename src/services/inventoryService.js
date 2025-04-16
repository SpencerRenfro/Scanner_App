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
    // Validate items
    const validatedItems = items.map(item => {
      // Generate a random ID if not provided
      if (!item.id) {
        item.id = Math.random().toString(36).substring(2, 6);
      }

      // Set default values for required fields if not provided
      if (!item.status) {
        item.status = 'IN';
      }

      // Generate current date if not provided
      if (!item.date) {
        const now = new Date();
        item.date = now.toLocaleDateString();

        // Add day of week and time if not provided
        if (!item.dayOfWeek) {
          item.dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
        }

        if (!item.time) {
          item.time = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        }
      }

      // Generate barcodeCombinedName if not provided
      if (item.barcode && item.name && !item.barcodeCombinedName) {
        item.barcodeCombinedName = `${item.barcode}_${item.name}`;
      }

      // Initialize empty arrays if not provided
      if (!item.itemCollection) {
        item.itemCollection = [];
      }

      return item;
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
 * Delete all inventory items
 * @returns {Promise} - Promise that resolves when all items are deleted
 */
export const deleteAllInventory = async () => {
  try {
    // First, get all inventory items
    const response = await fetch(`${API_URL}/inventory`);
    if (!response.ok) {
      throw new Error('Failed to fetch inventory items');
    }

    const items = await response.json();

    // Delete each item
    const deletePromises = items.map(item => {
      return fetch(`${API_URL}/inventory/${item.id}`, {
        method: 'DELETE'
      }).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete item: ${item.name}`);
        }
        return response;
      });
    });

    // Wait for all deletions to complete
    await Promise.all(deletePromises);

    return {
      success: true,
      count: items.length
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
