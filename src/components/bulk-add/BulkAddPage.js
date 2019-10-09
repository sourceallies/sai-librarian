import React, {useEffect, useRef, useReducer, useState} from 'react';
import BarcodeScanner from './BarcodeScanner';

async function getBookData(isbn) {
    const url = new URL('/api/books?jscmd=data', window.location.href);
    url.searchParams.set('bibkeys', `ISBN:${isbn}`);
    url.searchParams.set('jscmd', 'data');
    url.searchParams.set('format', 'json');
    const response = await fetch(url.href, {
        headers: {
            'accept': 'application/json'
        }
    });
    if (response.ok) {
        const body = await response.json();
        return body[`ISBN:${isbn}`];
    }
    if (response.status === 404) {
        return undefined;
    }
    throw new Error('Error: ' + response.status);
}

function bookReducer(currentState, event) {
    return {
        ...currentState,
        ...event
    };
}

function IdInput({book, dispatchBookChange}) {
    function onChange(e) {
        dispatchBookChange({
            id: e.target.value
        });
    }

    return (
        <label>
            Id:
            <input value={book.id} onChange={onChange} />
        </label>
    );
}

function IsbnInput({book, dispatchBookChange}) {
    function onChange(e) {
        dispatchBookChange({
            isbn: e.target.value
        });
    }

    return (
        <label>
            ISBN:
            <input value={book.isbn} onChange={onChange} />
        </label>
    );
}

function TitleInput({book, dispatchBookChange}) {
    function onChange(e) {
        dispatchBookChange({
            title: e.target.value
        });
    }

    return (
        <label>
            Title:
            <input value={book.title} onChange={onChange} />
        </label>
    );
}

function ShelfInput({book, dispatchBookChange}) {
    function onChange(e) {
        dispatchBookChange({
            shelf: e.target.value
        });
    }

    return (
        <label>
            Shelf:
            <input value={book.shelf} onChange={onChange} />
        </label>
    );
}

export default function BulkAddPage() {
    const [book, dispatchBookChange] = useReducer(bookReducer, {});

    async function onCodeScanned(scanResult) {
        const {text, format} = scanResult;
        console.log(`Scanned ${format}: ${text}`);

        dispatchBookChange({
            isbn: text,
            shelf: format
        });
        const bookData = await getBookData(text);
        if (bookData) {
            dispatchBookChange({
                isbn: bookData.identifiers.isbn_13,
                title: bookData.title,
            });
        }
    }

    return (
        <form>
            <h1>Add a book</h1>
            <IdInput book={book} dispatchBookChange={dispatchBookChange} />
            <IsbnInput book={book} dispatchBookChange={dispatchBookChange} />
            <TitleInput book={book} dispatchBookChange={dispatchBookChange} />
            <ShelfInput book={book} dispatchBookChange={dispatchBookChange} />

            <BarcodeScanner onCodeScanned={onCodeScanned} />
        </form>
    );
}