import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerStyles.css'; // Import custom styles

export default function FilterLogs({ statusFilter, setStatusFilter, dateFilter, setDateFilter, logs }) {
  const [selectedDate, setSelectedDate] = useState(null);

  // Handle change event for the status select element
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  // Handle date change from the DatePicker
  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (date) {
      // Format the date as MM/DD/YYYY to match your log format
      const formattedDate = date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      setDateFilter(formattedDate);
    } else {
      // If date is cleared, reset the filter
      setDateFilter('');
    }
  };

  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate(null);
    setDateFilter('');
  };

  return (
    <div className="col-span-5 flex flex-col sm:flex-row gap-4 dark:text-white">
      {/* Status Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Status</label>
        <select
          className="select w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
          onChange={handleStatusChange}
          value={statusFilter}
        >
          <option value="">All Statuses</option>
          <option value="CREATED">Created</option>
          <option value="OUT">Out</option>
          <option value="IN">In</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="DELETED">Deleted</option>
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Date</label>
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="select w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholderText="Select a date"
            dateFormat="MM/dd/yyyy"
            isClearable
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={10}
          />
          {dateFilter && (
            <div className="mt-2">
              <span className="badge badge-info mr-2 dark:bg-blue-800 dark:text-white">{dateFilter}</span>
              <button
                onClick={clearDateFilter}
                className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
