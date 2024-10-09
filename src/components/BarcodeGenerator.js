import React, { useEffect, useRef } from 'react';
import bwipjs from 'bwip-js';

const BarcodeGenerator = ({ barcodeState }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (barcodeState) {
      generateBarcode(barcodeState);
    }
  }, [barcodeState]); // Trigger when barcodeState changes

  const generateBarcode = (barcodeText) => {
    try {
      bwipjs.toCanvas(canvasRef.current, {
        bcid: 'code128', // Barcode type
        text: barcodeText, // Text to encode
        scale: 3, // 3x scaling factor
        height: 10, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: 'center', // Text alignment
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BarcodeGenerator;
