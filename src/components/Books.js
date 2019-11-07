import React, {useState, useEffect} from 'react';
import documentClient from '../configuredDocumentClient';

function useGetBook(bookId) {
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
}

async function updateBookStatus(bookId, checkedOutBy) {
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
}

function AvailablityParagraph({book}) {
    if (book.checkedOutBy) {
        return <p>Currently checked out by {book.checkedOutBy}</p>;
    }
    return <p>This book is available</p>;
}

function ShelfParagraph({book}) {
    if (book.checkedOutBy) {
        return <p>Return this book to shelf {book.shelf}</p>;
    }
    return <p>This book is located on shelf {book.shelf}</p>;
}

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

    async function onToggleAvailability() {
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
    }

    return (
        <main>
            <h1>{book.title} <small>{book.isbn}</small></h1>

            <p>{successMessage}</p>

            <AvailablityParagraph book={book} />
            <ShelfParagraph book={book} />

            <button onClick={onToggleAvailability}>{book.checkedOutBy ? 'Return' : 'Check Out'}</button>
        </main>
    );
};

export default Books;