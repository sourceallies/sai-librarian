import React, {useEffect, useRef, useReducer, useState} from 'react';
import Quagga from 'quagga';



async function initQuagga(options, onDetected) {
    return new Promise((resolve, reject) => {
        Quagga.init(options, (err) => {
            if (err) {
                console.error('Error initializing Quagga', err);
                reject(err);
            } else {
                Quagga.onDetected(onDetected);
                Quagga.start();
                console.log('Quagga initialization finished.');
                resolve();
            }
        })
    });
}

export default function BarcodeScanner({onCodeScanned}) {
    const scannerRef = useRef();
    const [error, setError] = useState();

    useEffect(() => {
        const scannerOptions = {
            inputStream : {
                name : "Live",
                type : "LiveStream",
                target: scannerRef.current
            },
            decoder : {
                readers: [
                    "upc_reader",
                    'code_128_reader',
                    'upc_e_reader',
                    'ean_reader',
                    'ean_8_reader'
                ],
                debug: {
                    drawBoundingBox: true,
                    showFrequency: false,
                    drawScanline: true,
                    showPattern: false
                }
            }
        };

        initQuagga(scannerOptions, onCodeScanned)
            .catch(setError);
        return () =>  Quagga.stop();
    }, [onCodeScanned]);

    return (
        <div>
            {error && <div>{error.message}</div>}
            <div ref={scannerRef}></div>
        </div>
    );
}