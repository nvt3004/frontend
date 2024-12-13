import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useToast } from './ToastContext';
import * as qz from 'qz-tray';


const InvoicePrint = ({ orderId }) => {
    const [pdfImage, setPdfImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [qzConnected, setQzConnected] = useState(false); // Track QZ connection status
    const toast = useToast();

    useEffect(() => {
        const fetchAndConvertPdf = async () => {
            setIsLoading(true);
            try {
                const response = await axios.post(`/staff/orders/export?orderId=${orderId}`, {}, { responseType: 'blob' });
                if (!response || !response.data) {
                    throw new Error("No PDF data received from backend.");
                }
                const pdfImageResult = await getPDFAsImage(new Blob([response.data], { type: 'application/pdf' }));
                setPdfImage(pdfImageResult);
            } catch (error) {
                toast.error(`Error fetching or converting PDF: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        if (orderId) {
            fetchAndConvertPdf();
        }
    }, [orderId, toast]);

    const handlePrint = async () => {
        if (!pdfImage) {
            toast.error("PDF not loaded yet!");
            return;
        }
        try {
            // Connect to QZ Tray ONLY if not already connected
            if (!qzConnected) {
                const options = {
                    host: 'localhost',
                    port: { secure: [8181, 8282, 8383, 8484], insecure: [8182, 8283, 8384, 8485] },
                    usingSecure: false,
                    keepAlive: 60,
                    retries: 3,
                    delay: 5
                };
                await qz.websocket.connect(options);
                setQzConnected(qz.websocket.isActive());
            }
            if (!qzConnected){
                throw new Error("Failed to connect to QZ Tray")
            }
            const printerName = 'YourPrinterName'; // REPLACE this!!
            const printConfig = qz.configs.create(printerName);
            const printResult = await qz.print(printConfig, [{ type: 'image', format: 'base64', data: pdfImage.base64 }]);
            toast.success('Print successful!', printResult);
        } catch (error) {
            toast.error(`Print error: ${error.message}`);
        } finally {
            if(qzConnected) qz.websocket.disconnect();
            setQzConnected(false);
        }
    };

    return (
        <div>
            {isLoading && <p>Loading PDF...</p>}
            {pdfImage && <button onClick={handlePrint}>Print Invoice</button>}
        </div>
    );
};


const getPDFAsImage = async (pdfBlob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const pdfData = e.target.result;
                const pdfDoc = new jsPDF(); // Create a jsPDF instance
                await pdfDoc.load(pdfData); // Load the PDF data (Async operation)
                const page = await pdfDoc.getPage(1); //Get page 1
                if (!page) {
                    throw new Error('PDF has no pages or is corrupted.');
                }
                const imgData = await page.getImage();
                if(!imgData){
                    throw new Error('Could not get image from PDF page.');
                }
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = imgData.width;
                canvas.height = imgData.height;
                ctx.drawImage(imgData, 0, 0);
                const base64Image = canvas.toDataURL('image/png');
                resolve({ base64: base64Image.split(',')[1] });
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(pdfBlob);
    });
};

export default InvoicePrint;