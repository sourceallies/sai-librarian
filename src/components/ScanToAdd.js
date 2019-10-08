import React, {useEffect, useRef, useReducer, useState} from 'react';
import Quagga from 'quagga';

async function getBookData(isbn) {
    const url = new URL('http://openlibrary.org/api/books?jscmd=data');
    url.searchParams.set('bibkeys', `ISBN:${isbn}`);
    const response = await fetch(url.href);
    if (response.ok) {
        const body = await response.json();
        return body[`ISBN:${isbn}`];
    }
    throw new Error('Error: ' + response.status);
}

function FoundBarcode({isbn}) {
    const [bookData, setBookData] = useState();
    useEffect(() => {
        getBookData(isbn).then(setBookData);
    }, [isbn]);

    if (!bookData) {
        return <li>{isbn}</li>;
    }

    return (
        <li>
            {isbn}
            {bookData.title}
            <img src={bookData.cover.small} />
        </li>
    )
}

function codeReducer(codes, detectEvent) {
    const code = detectEvent.codeResult.code;

    if (!codes.includes(code)) {
        return [...codes, code];
    }
    return codes;
}

async function setupScanner(target, dispatchCode, setError) {
    // await navigator.mediaDevices.getUserMedia({video: true});
    Quagga.init({
        inputStream : {
            name : "Live",
            type : "LiveStream",
            target
        },
        decoder : {
            readers : ["ean_reader"]
        }
    }, (err) => {
        if (err) {
            setError(err)
        } else {
            console.log("Initialization finished. Ready to start");
            Quagga.onDetected(dispatchCode);
            Quagga.start();
        }
    });
}

export default function ScanToAdd() {
    const scannerRef = useRef();
    const [error, setError] = useState();
    const [codes, dispatchCode] = useReducer(codeReducer, []);

    useEffect(() => {
        setupScanner(scannerRef.current, dispatchCode, setError)
    }, []);

    return (
        <div>
            <h1>Add a book</h1>
            {error && <div>{error.message} Stack: {error.stack}</div>}
            <ul>
                {codes.map(c => <FoundBarcode key={c} isbn={c} />)}
            </ul>
            <div ref={scannerRef}></div>

        </div>
    );
}