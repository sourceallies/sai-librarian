import React, { useReducer, useState } from 'react';
import documentClient from '../../configuredDocumentClient';

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

function isISBN(maybeIsbn) {
    return /[0-9]{10}/.test(maybeIsbn);
}

async function handleISBNScan(isbn, dispatchBookChange) {
    dispatchBookChange({isbn});
    const bookData = await getBookData(isbn);
    if (bookData) {
        dispatchBookChange({
            title: bookData.title,
        });
    }
}

function handlePossibleUrl(possibleUrl, dispatchBookChange) {
    try {
        const url = new URL(possibleUrl);
        const id = url.pathname.split('/').pop();
        dispatchBookChange({id});
        return true;
    } catch (e) {
        return false;
    }
}

function bookReducer(currentState, event) {
    return {
        ...currentState,
        ...event
    };
}

function submittedReducer(list, book) {
    return [book, ...list];
}

export default function BulkAddPage() {
    const [scannerValue, setScannerValue] = useState('');
    const [book, dispatchBookChange] = useReducer(bookReducer, {
        isbn: '',
        title: '',
        id: '',
        shelf: ''
    });
    const [submitted, dispatchSubmitted] = useReducer(submittedReducer, []);

    function onFieldChange(e) {
        dispatchBookChange({
            [e.target.name]: e.target.value
        });
    }

    async function onSubmit(event) {
        event.preventDefault();

        await documentClient.put({
            TableName: process.env.REACT_APP_BOOK_TABLE,
            Item: book
        }).promise();
        dispatchSubmitted(book);
        dispatchBookChange({
            isbn: '',
            title: '',
            id: ''
        });
    }

    async function handleScannerChange(event) {
        const value = event.target.value;
        if (isISBN(value)) {
            await handleISBNScan(value, dispatchBookChange);
            setScannerValue('');
        } else if (handlePossibleUrl(value, dispatchBookChange)) {
            setScannerValue('');
        } else {
            setScannerValue(value);
        }
    }

    return (
        <main>
            <form onSubmit={onSubmit}>
                <h1>Add a book</h1>

                <label>
                    Scanner Input
                    <input
                        value={scannerValue}
                        onChange={handleScannerChange}
                    />
                </label>

                <label>
                    Id
                    <input required
                        name='id'
                        value={book.id}
                        onChange={onFieldChange}
                    />
                </label>
                <label>
                    ISBN
                    <input required
                        name='isbn'
                        value={book.isbn}
                        onChange={onFieldChange}
                    />
                </label>
                <label>
                    Title
                    <input required
                        name='title'
                        value={book.title}
                        onChange={onFieldChange}
                    />
                </label>
                <label>
                    Shelf
                    <input required
                        name='shelf'
                        value={book.shelf}
                        onChange={onFieldChange}
                    />
                </label>

                <button type='submit'>Save</button>
            </form>

            <table>
                <tbody>
                    {submitted.map(({id, isbn, title, shelf}) => <tr key={id}>
                        <td>{id}</td>
                        <td>{isbn}</td>
                        <td>{title}</td>
                        <td>{shelf}</td>
                    </tr>)}
                </tbody>
            </table>
        </main>
    );
}