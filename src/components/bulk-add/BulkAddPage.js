import React, { useReducer } from 'react';
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

function bookReducer(currentState, event) {
    return {
        ...currentState,
        ...event
    };
}

function submittedReducer(list, book) {
    return [book, ...list];
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

export default function BulkAddPage() {
    const [book, dispatchBookChange] = useReducer(bookReducer, '', createEmptyBookWithShelf);
    const [submitted, dispatchSubmitted] = useReducer(submittedReducer, []);

    function onFieldChange(e) {
        dispatchBookChange({
            [e.target.name]: e.target.value
        });
    }

    function onIdScanned(bookId) {
        dispatchBookChange({bookId});
    }

    async function onIsbnScanned(isbn) {
        dispatchBookChange({isbn});
        const bookData = await getBookData(isbn);
        if (bookData) {
            dispatchBookChange({
                title: bookData.title,
            });
        }
    }

    async function onSubmit(event) {
        event.preventDefault();

        await documentClient.put({
            TableName: process.env.REACT_APP_BOOK_TABLE,
            Item: book
        }).promise();
        dispatchSubmitted(book);
        dispatchBookChange(createEmptyBookWithShelf(book.shelf));
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