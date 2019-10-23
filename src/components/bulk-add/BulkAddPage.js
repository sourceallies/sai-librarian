import React, { useState } from 'react';
import ScannerInput from './ScannerInput';
import documentClient from '../../configuredDocumentClient';
import styles from './BulkAddPage.module.css';

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

function createEmptyBookWithShelf(shelf) {
    return {
        neckOfTheWoods: 'Library',
        isAvailable: true,
        bookId: '',
        isbn: '',
        title: '',
        shelf
    }
}

function isComplete({bookId, isbn, title, shelf}) {
    return bookId && isbn && title && shelf;
}

export default function BulkAddPage() {
    const [book, setBook] = useState(createEmptyBookWithShelf(''));
    const [submitted, setSubmitted] = useState([]);

    function onFieldChange(e) {
        const key = e.target.name;
        const value = e.target.value
        setBook((previousState) => ({
            ...previousState,
            [key]: value
        }));
    }

    function submitIfComplete(bookToSubmit) {
        if (!isComplete(bookToSubmit)) {
            return bookToSubmit;
        }

        documentClient.put({
            TableName: process.env.REACT_APP_BOOK_TABLE,
            Item: bookToSubmit
        }).promise().then(() => {
            setSubmitted((previouslySubmitted) => [bookToSubmit, ...previouslySubmitted]);
        }, (err) => console.error(err));

        return createEmptyBookWithShelf(book.shelf);
    }

    function onIdScanned(bookId) {
        setBook((previousState) => {
            const newState = {
                ...previousState,
                bookId
            };
            return submitIfComplete(newState);
        });
    }

    async function onIsbnScanned(isbn) {
        setBook((previousState) => {
            return {
                ...previousState,
                isbn
            };
        });

        const bookData = await getBookData(isbn);
        if (bookData) {
            setBook((previousState) => {
                const newState = {
                    ...previousState,
                    title: bookData.title,
                };
                return submitIfComplete(newState);
            });
        }
    }

    function onSubmit(event) {
        event.preventDefault();
        submitIfComplete(book);
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Bulk Add Books</h1>

            <ScannerInput
                onIdScanned={onIdScanned}
                onIsbnScanned={onIsbnScanned} />

            <table className={styles.bookTable}>
                <thead>
                    <tr>
                        <th>
                            <label>
                                Id
                                <input required
                                    name='bookId'
                                    value={book.bookId}
                                    onChange={onFieldChange}
                                />
                            </label>
                        </th>
                        <th>
                            <label>
                                ISBN
                                <input required
                                    name='isbn'
                                    value={book.isbn}
                                    onChange={onFieldChange}
                                />
                            </label>
                        </th>
                        <th>
                            <label>
                                Title
                                <input required
                                    name='title'
                                    value={book.title}
                                    onChange={onFieldChange}
                                />
                            </label>
                        </th>
                        <th>
                            <label>
                                Shelf
                                <input required
                                    name='shelf'
                                    value={book.shelf}
                                    onChange={onFieldChange}
                                />
                            </label>
                        </th>
                        <th>
                            <button type='submit'>Save</button>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {submitted.map(({bookId, isbn, title, shelf}) => <tr key={bookId}>
                        <td>{bookId}</td>
                        <td>{isbn}</td>
                        <td>{title}</td>
                        <td>{shelf}</td>
                    </tr>)}
                </tbody>
            </table>
        </form>
    );
}