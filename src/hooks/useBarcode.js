import bwipjs from 'bwip-js';
import { useEffect, useState } from 'react';

export const useBarcodeGenerator = (barcode) => {
    useEffect(() => {
       const generateBarcode = () => {
           try {
               bwipjs.toCanvas(`${barcode}`, {
                   bcid: 'code128', // Barcode type
                   text: barcode, // Text to encode
                   scale: 3, // 3x scaling factor
                   height: 10, // Bar height, in millimeters
                   includetext: true, // Show human-readable text
                   textxalign: 'center', // Text alignment
               });

           } catch (e) {
               console.error(e);
           }
       };
       if(barcode){
           generateBarcode();
       }
    }, [barcode]);
    return <canvas id={barcode}></canvas>;
};