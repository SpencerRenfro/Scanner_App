import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import bwipjs from "bwip-js";

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

  // Auto-trigger print dialog after item is loaded
  useEffect(() => {
    if (item && !loading) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [item, loading]);

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
    <div className="print-preview-page">
      {/* This is what will be printed */}
      <div className="print-content flex flex-col items-center justify-center min-h-screen p-8 gap-6">
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
          <div className="no-print bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
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
                onClick={() => window.print()}
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
