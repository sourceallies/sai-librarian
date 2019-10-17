import React, {useEffect, useRef, useState} from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat} from '@zxing/library';

const hints = new Map();
hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE
]);

export default function BarcodeScanner({onCodeScanned}) {
    const scannerRef = useRef();
    const [error, setError] = useState();

    useEffect(() => {
        const reader = new BrowserMultiFormatReader(hints);
        // reader.decodeFromVideoDevice(undefined, scannerRef.current, (result, error) => {
        //     if (error) {
        //         setError(error);
        //     } else {
        //         setError(null);
        //         onCodeScanned(result);
        //     }
        // }).catch(setError);

        (async () => {
            while (true) {
                const result = await reader.decodeFromInputVideoDevice(undefined, scannerRef.current);
                console.log('got result', result);
                onCodeScanned(result);
            }
        })();
    }, [onCodeScanned]);

    return (
        <div>
            {error && <div>{error.message}</div>}
            <video
                ref={scannerRef}
                style={{
                    border: '1px solid gray',
                    width: '100%'
                }}
            />
        </div>
    );
}