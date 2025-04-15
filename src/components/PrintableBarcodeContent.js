import React, { useEffect, useRef, useState } from 'react';
import bwipjs from 'bwip-js';

const PrintableBarcodeContent = ({ item }) => {
  const canvasRef = useRef(null);
  const [barcodeGenerated, setBarcodeGenerated] = useState(false);

  useEffect(() => {
    if (item && item.barcode && canvasRef.current) {
      generateBarcode(item.barcode);
      setBarcodeGenerated(true);
    }
  }, [item]);

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

  if (!item) return null;

  return (
    <div id="printable-barcode" className="print-only-content">
      <div className="print-content-wrapper">
        <h2 className="item-name">{item.name}</h2>
        <p className="item-id">ID: {item.id}</p>
        <div className="barcode-wrapper">
          <canvas ref={canvasRef} className="barcode-canvas" width="200" height="80" />
        </div>
        {!barcodeGenerated && <p className="barcode-fallback">Barcode: {item.barcode}</p>}
      </div>
    </div>
  );
};

export default PrintableBarcodeContent;
