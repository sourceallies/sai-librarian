import React, { useState } from 'react';

function attemptToExtractId(possibleUrl) {
    try {
        const url = new URL(possibleUrl);
        return url.pathname.split('/').pop();
    } catch (e) {
        return undefined;
    }
}

function isISBN(maybeIsbn) {
    return /[0-9]{10}/.test(maybeIsbn);
}

export default function ScannerInput({onIsbnScanned, onIdScanned}) {
    const [scannerValue, setScannerValue] = useState('');

    function handleScannerChange(value) {
        if (isISBN(value)) {
            onIsbnScanned(value);
            setScannerValue('');
            return;
        }
        const id = attemptToExtractId(value);
        if (id) {
            onIdScanned(id);
            setScannerValue('');
        } else {
            setScannerValue(value);
        }
    }

    function onChange(event) {
        setScannerValue(event.target.value);
    }

    function onKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleScannerChange(event.target.value);
        }
    }

    return (
        <label>
            Scanner Input
            <input
                value={scannerValue}
                onChange={onChange}
                onKeyPress={onKeyPress}
            />
        </label>
    );
}
