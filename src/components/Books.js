import React, {useState, useEffect} from 'react';
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
    if (book.checkedOutBy) {
        return <p>Currently checked out by {book.checkedOutBy}</p>;
    }
    return <p>This book is available</p>;
};

const ShelfParagraph = ({book}) => {
    if (book.checkedOutBy) {
        return <p>Return this book to shelf {book.shelf}</p>;
    }
    return <p>This book is located on shelf {book.shelf}</p>;
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
        <main>
            <h1>{book.title} <small>{book.isbn}</small></h1>

            <p>{successMessage}</p>

            <AvailablityParagraph book={book} />
            <ShelfParagraph book={book} />

            {book.checkedOutBy
                ? <button onClick={onReturnBook}>Return</button>
                : <button onClick={onCheckoutBook}>Check Out</button>
            }
        </main>
    );
};

export default Books;