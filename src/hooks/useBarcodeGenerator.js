import { useState, useEffect, useRef } from "react";
import bwipjs from 'bwip-js';


export const useBarcodeGenerator = (itemName, setBarcodeState) => {


    // const canvasRef = useRef(null);
    const barcode = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');

    useEffect(() => {
        console.log(`Barcode Generated ${barcode},  ${typeof barcode}`);
        setBarcodeState(barcode);

        const fetchBarcode = () => {
            try {
                bwipjs.toCanvas(`${itemName}`, {
                    bcid: 'code128', // Barcode type
                    text: barcode, // Text to encode
                    scale: 3, // 3x scaling factor
                    height: 10, // Bar height, in millimeters
                    includetext: true, // Show human-readable text
                    textxalign: 'center', // Text alignment
                });
                // const dataURL = canvasRef.current.toDataURL();
                // console.log('dataURL', dataURL);

                // setBarcode_image(canvasRef.current.toDataURL());
                } catch (e) {
                console.error(e);
                }
        };
        if(itemName){
            fetchBarcode();
        }

    }, [itemName]);

    // return { barcodeObject, canvasRef, barcode, barcodeImage };
    return { barcode };
};
