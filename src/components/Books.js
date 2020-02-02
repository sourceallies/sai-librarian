import React, {useState, useEffect} from 'react';
import styles from './Books.module.css';
import documentClient from '../configuredDocumentClient';
import { useBookData } from '../utils/useBookData';

const useGetBook = (bookId) => {
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        documentClient.get({
            TableName: process.env.REACT_APP_BOOK_TABLE,
            Key: {
              bookId
            }
        }).promise()
            .then(({Item}) => setBook(Item))
            .catch((e) => {
                console.error(e);
                setError(e);
            })
            .finally(() => setLoading(false));
    }, [bookId]);

    return {
        loading,
        error,
        book,
        setBook
    };
};

const updateBookToReturned = (bookId, userProfile) => {
    const event = {
        timestamp: new Date(Date.now()).toJSON(),
        name: userProfile.name,
        email: userProfile.email
    };
    return documentClient.update({
        TableName: process.env.REACT_APP_BOOK_TABLE,
        Key: {
            bookId
        },
        UpdateExpression: "set checkedOutBy=:l, returnEvents=list_append(if_not_exists(returnEvents, :emptyList), :newEvents)",
        ExpressionAttributeValues: {
            ':l': null,
            ':emptyList': [],
            ':newEvents': [event]
        },
        ReturnValues: 'UPDATED_NEW'
    }).promise();
};

const updateBookToCheckedOut = (bookId, userProfile) => {
    const event = {
        timestamp: new Date(Date.now()).toJSON(),
        name: userProfile.name,
        email: userProfile.email
    };
    return documentClient.update({
        TableName: process.env.REACT_APP_BOOK_TABLE,
        Key: {
            bookId
        },
        UpdateExpression: "set checkedOutBy=:l, checkOutEvents=list_append(if_not_exists(checkOutEvents, :emptyList), :newEvents)",
        ExpressionAttributeValues: {
            ':l': event.name,
            ':emptyList': [],
            ':newEvents': [event]
        },
        ReturnValues: 'UPDATED_NEW'
    }).promise();
}

const AvailablityParagraph = ({book}) => {
    const {checkedOutBy, shelf} = book;

    if (checkedOutBy) {
        return <p>This book is currently checked out by {book.checkedOutBy}. Return it to shelf {shelf} when complete.</p>;
    }
    return <p>This book is available and located on shelf {shelf}.</p>;
};

const Books = ({match, history, user}) => {
    const {loading, book, error, setBook} = useGetBook(match.params.id);
    const [successMessage, setSuccessMessage] = useState();

    const bookData = useBookData(book && book.isbn);
    const imageUrl = (bookData && bookData.cover) ? bookData.cover.large : '';

    if (loading) {
        return (<div>Loading...</div>);
    }

    if (error) {
        return (<div>Error: {error.message}</div>);
    }

    if (!book) {
        history.push(`/books/${match.params.id}/create`);
        return null;
    }

    const onCheckoutBook = async () => {
        const response = await updateBookToCheckedOut(book.bookId, user.profile);
        setBook((prevState) => {
            return {
                ...prevState,
                ...response.Attributes
            };
        });
        setSuccessMessage('Book successfully checked out');
    };

    const onReturnBook = async () => {
        const response = await updateBookToReturned(book.bookId, user.profile);
        setBook((prevState) => {
            return {
                ...prevState,
                ...response.Attributes
            };
        });
        setSuccessMessage('Book successfully returned');
    };

    return (
        <main className={styles.bookDetails}>
            <h1>{book.title}</h1>

            <p><strong>ISBN:</strong> {book.isbn}</p>

            <img src={imageUrl} alt={`Cover for ${book.title}`} data-testid={`${book.isbn}-cover`} />

            {successMessage && <p>{successMessage}</p>}

            <AvailablityParagraph book={book} />

            {book.checkedOutBy
                ? <button onClick={onReturnBook}>Return</button>
                : <button onClick={onCheckoutBook}>Check Out</button>
            }
        </main>
    );
};

export default Books;