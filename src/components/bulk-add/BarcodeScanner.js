import React, {useEffect, useRef, useReducer, useState} from 'react';
// import Quagga from 'quagga';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat} from '@zxing/library';

export default function BarcodeScanner({onCodeScanned}) {
    const scannerRef = useRef();
    const [error, setError] = useState();

    async function doInit() {
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.EAN_13,
            BarcodeFormat.QR_CODE
        ]);
        const reader = new BrowserMultiFormatReader(hints);

        while (true) {
            const result = await reader.decodeFromInputVideoDevice(undefined, scannerRef.current);
            console.log('got result', result);
            onCodeScanned(result);
        }
    }

    useEffect(() => {
        doInit();
    }, [onCodeScanned]);

    return (
        <div>
            {error && <div>{error.message}</div>}
            <video
                id="video"
                width="640"
                height="480"
                ref={scannerRef}
                style={{border: '1px solid gray'}}
            />
        </div>
    );
}