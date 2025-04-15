import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import bwipjs from "bwip-js";

// Images
import scan from "../assets/icons/scan.svg";
import close from "../assets/close.svg";

const PrintPreview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch item data
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/inventory/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch item data");
        }
        const data = await response.json();
        setItem(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  // Generate barcode when item data is loaded
  useEffect(() => {
    if (item?.barcode && canvasRef.current) {
      generateBarcode(item.barcode);
    }
  }, [item]);

  // Print function
  const handlePrint = () => {
    // Ensure the barcode is generated before printing
    if (item?.barcode && canvasRef.current) {
      try {
        // Force regenerate the barcode
        generateBarcode(item.barcode);

        // Create a print-specific version
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          alert('Please allow pop-ups to print the barcode');
          return;
        }

        // Create the print content
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Barcode - ${item.name}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  padding: 0;
                }
                .card {
                  background-color: white;
                  border-radius: 0.75rem;
                  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                  max-width: 350px;
                  width: 100%;
                }
                .card-header {
                  background-color: #4f46e5;
                  color: white;
                  padding: 1rem;
                }
                .card-header h1 {
                  font-size: 18px;
                  font-weight: bold;
                  text-align: center;
                  margin: 0;
                }
                .card-body {
                  padding: 1.5rem;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                }
                .id-text {
                  font-size: 12px;
                  color: #6b7280;
                  margin-bottom: 1rem;
                }
                .barcode-container {
                  background-color: #f9fafb;
                  border-radius: 0.5rem;
                  padding: 1.5rem;
                  width: 100%;
                  margin-bottom: 1.5rem;
                  display: flex;
                  justify-content: center;
                }
                .hint-text {
                  font-size: 10px;
                  color: #9ca3af;
                }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="card-header">
                  <h1>${item.name}</h1>
                </div>
                <div class="card-body">
                  <p class="id-text">ID: ${item.id}</p>
                  <div class="barcode-container">
                    <img src="${canvasRef.current.toDataURL('image/png')}" alt="Barcode" />
                  </div>
                  <p class="hint-text">Scan this barcode to track the item</p>
                </div>
              </div>
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    setTimeout(function() {
                      window.close();
                    }, 500);
                  }, 300);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } catch (error) {
        console.error('Error preparing print:', error);
        // Fallback to regular print
        window.print();
      }
    } else {
      // Fallback to regular print
      window.print();
    }
  };

  const generateBarcode = (barcodeText) => {
    try {
      // Get canvas dimensions
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Calculate appropriate scale based on text length
      const textLength = barcodeText.length;
      let scale = 3;

      // Adjust scale for longer barcodes
      if (textLength > 12) {
        scale = 2.5;
      } else if (textLength > 8) {
        scale = 3;
      }

      // Generate the barcode
      bwipjs.toCanvas(canvas, {
        bcid: "code128", // Barcode type
        text: barcodeText, // Text to encode
        scale: scale, // Dynamic scaling factor
        height: 15, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: "center", // Text alignment
        textsize: 10, // Text size in points
        textyoffset: 5, // Offset for text
      });

      console.log(`Generated barcode with dimensions: ${canvas.width}x${canvas.height}`);
    } catch (e) {
      console.error("Error generating barcode:", e);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Show loading or error state
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!item) {
    return <div className="text-center p-8">Item not found</div>;
  }

  return (
    <div className="print-preview-page bg-slate-100 min-h-screen">
      {/* Navbar similar to SingleItemData page */}
      <div className="flex items-center justify-between p-6 shadow-lg bg-white print:hidden">
        <div className="flex items-center gap-3">
          <img src={scan} width={28} height={28} alt="barcode" className="opacity-80" />
          <h1 className="text-xl font-semibold">{item ? item.name : 'Item Details'}</h1>
        </div>
        <div className="flex items-center gap-3">

          <NavLink
            to="/"
            className="hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center"
          >
            <img src={close} width={24} alt="close" />
          </NavLink>
        </div>
      </div>

      {/* This is what will be printed */}
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center gap-6 print:visible print:absolute print:inset-0 print:p-0 print:m-0 print:flex print:flex-col print:items-center print:justify-center print:bg-white">
        {/* Barcode Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
          <div className="bg-indigo-600 p-4 text-white">
            <h1 className="text-xl font-bold text-center">{item.name}</h1>
          </div>
          <div className="p-6 flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-4">ID: {item.id}</p>
            <div className="bg-gray-50 p-6 rounded-lg w-full mb-4 overflow-visible">
              <div className="flex justify-center">
                <canvas ref={canvasRef} width="250" height="100" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Scan this barcode to track the item
            </p>
          </div>

          {/* Action Buttons Card - This will be hidden when printing */}
          <div className="no-print rounded-xl shadow-lg overflow-hidden max-w-md w-full mt-6">
            <div className="p-4 flex justify-center gap-4">
              <button
                onClick={handleBackClick}
                className="flex items-center justify-center px-6 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;
