import React, {useState, useEffect} from 'react';
import styles from './Books.module.css';
import documentClient from '../configuredDocumentClient';

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

const updateBookStatus = async (bookId, checkedOutBy) => {
    return await documentClient.update({
        TableName: process.env.REACT_APP_BOOK_TABLE,
        Key: {
            bookId
        },
        UpdateExpression: "set checkedOutBy=:l",
        ExpressionAttributeValues: {
            ':l': checkedOutBy
        },
        ReturnValues: 'UPDATED_NEW'
    }).promise();
};

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

    const onToggleAvailability = async () => {
        const newCheckedOutBy = book.checkedOutBy ? null : user.profile.name;
        const response = await updateBookStatus(book.bookId, newCheckedOutBy);
        setBook((prevState) => {
            return {
                ...prevState,
                ...response.Attributes
            };
        });
        if (newCheckedOutBy) {
            setSuccessMessage('Book successfully checked out');
        } else {
            setSuccessMessage('Book successfully returned');
        }
    };

    return (
        <main className={styles.bookDetails}>
            <h1>{book.title}</h1>

            <p><strong>ISBN:</strong> {book.isbn}</p>

            {successMessage && <p>{successMessage}</p>}

            <AvailablityParagraph book={book} />

            <button className={styles.checkInOutButton} onClick={onToggleAvailability}>{book.checkedOutBy ? 'Return' : 'Check Out'}</button>
        </main>
    );
};

export default Books;