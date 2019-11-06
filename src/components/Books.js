import React, {useState, useEffect} from 'react';
import documentClient from '../configuredDocumentClient';
import {getBookByBookId} from "../utils/getBook";
import BookDetail from "./BookDetail";
import BookCreate from "./BookCreate";

function useGetBook(bookId) {
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState();

    useEffect(() => {
        documentClient.get({
            TableName: process.env.REACT_APP_BOOK_TABLE,
            Key: {
              bookId
            }
        }).promise()
            .then(({Item}) => setBook(Item))
            .catch((err) => console.log('Error getting book: ', err))
            .finally(() => setLoading(false));
    }, [bookId]);

    return {
        loading,
        book,
        setBook
    };
}

function AvailableBookDetails({book, setBook, setSuccessMessage, currentUser}) {
    async function onCheckout() {
        const response = await documentClient.update({
            TableName: process.env.REACT_APP_BOOK_TABLE,
            Key: {
                bookId: book.bookId
            },
            UpdateExpression: "set checkedOutBy=:l",
            ExpressionAttributeValues: {
                ':l': currentUser
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();
        setBook((prevState) => {
            return {
                ...prevState,
                ...response.Attributes
            };
        });
        setSuccessMessage('Book successfully checked out');
        console.log(response);
    }

    return (
        <>
            <p>Available</p>
            <p>This book is located on shelf {book.shelf}</p>
            <button onClick={onCheckout}>Check Out</button>
        </>
    );
}

function CheckedOutBookDetails({book, setBook, setSuccessMessage}) {
    async function onReturn() {
        const response = await documentClient.update({
            TableName: process.env.REACT_APP_BOOK_TABLE,
            Key: {
                bookId: book.bookId
            },
            UpdateExpression: "set checkedOutBy=:l",
            ExpressionAttributeValues: {
                ':l': null
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();
        setSuccessMessage('Book successfully returned');
        setBook((prevState) => {
            return {
                ...prevState,
                ...response.Attributes
            };
        });
        console.log(response);
    }

    return (
        <>
            <p>Currently checked out by {book.checkedOutBy}</p>
            <p>Return this book to shelf {book.shelf}</p>
            <button onClick={onReturn}>Return</button>
        </>
    );
}

const Books = (props) => {
    const {loading, book, setBook} = useGetBook(props.match.params.id);
    const [successMessage, setSuccessMessage] = useState();

    if (loading) {
        return (<h1>Loading...</h1>);
    }

    return (
        <main>
            <h1>{book.title} <small>{book.isbn}</small></h1>

            <p>{successMessage}</p>

            {book.checkedOutBy ?
                <CheckedOutBookDetails book={book} setBook={setBook} setSuccessMessage={setSuccessMessage} /> :
                <AvailableBookDetails book={book} setBook={setBook} setSuccessMessage={setSuccessMessage} currentUser={props.user.profile.name} />}
        </main>
    );

    // if (!book.bookId) {
    //     return (
    //     <BookCreate
    //         bookId={props.match.params.id}
    //         loggedInName={props.user.profile.name}
    //         token={props.user.id_token}
    //         history={props.history}
    //     />
    //     );
    // }

    // return (
    //     <BookDetail
    //         book={book}
    //         loggedInName={props.user.profile.name}
    //         history={props.history}
    //     />
    // );
};

export default Books;