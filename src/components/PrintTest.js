import React from 'react';
import PrintableBarcodeContent from './PrintableBarcodeContent';

const PrintTest = () => {
  // Sample item data for testing
  const testItem = {
    id: '12345',
    name: 'Test Item',
    barcode: 'TEST123456789',
    description: 'This is a test item',
    status: 'IN',
    price: 99.99
  };

  const handlePrintTest = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Print Test Page</h1>
      <p className="mb-4">This page tests the barcode printing functionality.</p>
      
      <button 
        onClick={handlePrintTest}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Print Barcode
      </button>
      
      <div className="mt-8 p-4 border rounded">
        <h2 className="font-bold">Preview of what should print:</h2>
        <div className="mt-4 border p-4 flex flex-col items-center">
          <h3 className="font-bold">{testItem.name}</h3>
          <p className="text-sm text-gray-600">ID: {testItem.id}</p>
          <p className="mt-2">Barcode: {testItem.barcode}</p>
        </div>
      </div>
      
      {/* This is what will actually be printed */}
      <PrintableBarcodeContent item={testItem} />
    </div>
  );
};

export default PrintTest;
