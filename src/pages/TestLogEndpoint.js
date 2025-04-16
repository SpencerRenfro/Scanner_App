import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

export default function TestLogEndpoint() {
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

  const {
    postData: postLogsData,
    data: logsData,
    error: logsError,
  } = useFetch("http://localhost:8000/itemLogs", "POST");

  const testLogEndpoint = () => {
    // Create a timestamp for unique ID
    const timestamp = Date.now();

    // Create a test log entry with a unique logId
    const testLogEntry = {
      id: `test_log_${timestamp}`,
      logId: `log_${timestamp}`,
      name: "Test Item",
      action: "TEST",
      date: new Date().toLocaleDateString(),
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      time: new Date().toLocaleTimeString(),
      barcode: "TEST123456",
      category: "Test Category"
    };

    // Post the test log entry
    postLogsData(testLogEntry);

    setTestResult("Test log entry sent. Check console for details.");
  };

  // Handle response
  React.useEffect(() => {
    if (logsData) {
      setTestResult(`Success! Log entry created with ID: ${logsData.id}`);
    }
    if (logsError) {
      setError(`Error: ${logsError}`);
    }
  }, [logsData, logsError]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test itemLogs Endpoint</h1>

      <button
        onClick={testLogEndpoint}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Log Endpoint
      </button>

      {testResult && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          {testResult}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
