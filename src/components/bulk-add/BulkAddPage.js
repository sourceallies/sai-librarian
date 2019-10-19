import React, { useReducer, useState } from 'react';

async function getBookData(isbn) {
    const searchParams = new URLSearchParams();
    searchParams.set('bibkeys', `ISBN:${isbn}`);
    searchParams.set('jscmd', 'data');
    searchParams.set('format', 'json');
    const response = await fetch(`/api/books?${searchParams}`, {
        headers: {
            'accept': 'application/json'
        }
    });
    if (response.ok) {
        const body = await response.json();
        return body[`ISBN:${isbn}`];
    }
    if (response.status === 404) {
        return '';
    }
    throw new Error('Error: ' + response.status);
}

async function handleISBNScan(isbn, dispatchBookChange) {
    dispatchBookChange({isbn});
    const bookData = await getBookData(isbn);
    if (bookData) {
        dispatchBookChange({
            // isbn: bookData.identifiers.isbn_13,
            title: bookData.title,
        });
    }
}

function isISBN(value) {
    return /^[0-9]+$/.test(value);
}

function handleUrlScanned(url, dispatchBookChange) {
    // const prefix = `${window.location.origin}/books/`;
    // if (url.startsWith(prefix)) {
        // const id = url.replace(prefix, '');
        dispatchBookChange({
            id: url
        });
    // }
}

function bookReducer(currentState, event) {
    return {
        ...currentState,
        ...event
    };
}

export default function BulkAddPage() {
    const [scannerValue, setScannerValue] = useState('');
    const [book, dispatchBookChange] = useReducer(bookReducer, {
        isbn: '',
        title: '',
        id: '',
        shelf: ''
    });

    function onFieldChange(e) {
        dispatchBookChange({
            [e.target.name]: e.target.value
        });
    }

    async function onSubmit(event) {
        event.preventDefault();
        console.log("handling submit: ", scannerValue);
        if (scannerValue.length) {
            if (isISBN(scannerValue)) {
                handleISBNScan(scannerValue, dispatchBookChange);
            } else {
                handleUrlScanned(scannerValue);
            }
            setScannerValue('');
        }

        // await postBook(book);
        // dispatchBookChange({
        //     isbn: '',
        //     title: '',
        //     id: ''
        // });
    }

    return (
        <main>
            <form onSubmit={onSubmit}>
                <h1>Add a book</h1>

                <label>
                    Scanner Input
                    <input
                        value={scannerValue}
                        onChange={(e) => setScannerValue(e.target.value)}
                    />
                </label>

                <label>
                    Id
                    <input required
                        name='id'
                        value={book.id}
                        // onChange={onFieldChange}
                    />
                </label>
                <label>
                    ISBN
                    <input required
                        name='isbn'
                        value={book.isbn}
                        // onChange={onFieldChange}
                    />
                </label>
                <label>
                    Title
                    <input required
                        name='title'
                        value={book.title}
                        // onChange={onFieldChange}
                    />
                </label>
                <label>
                    Shelf
                    <input required
                        name='shelf'
                        value={book.shelf}
                        // onChange={onFieldChange}
                    />
                </label>

                <button type='submit'>Save</button>
            </form>
        </main>
    );
}