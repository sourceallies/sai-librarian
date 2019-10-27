import React, {useState, useEffect} from 'react';
import {getBookByBookId} from "../utils/getBook";
import BookDetail from "./BookDetail";
import BookCreate from "./BookCreate";

const Books = (props) => {
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState({});

    useEffect(() => {
        getBookByBookId(props.match.params.id).then((data) => {
            if (data.Item) {
                setBook(data.Item);
            }
            setLoading(false);
        }).catch((err) => console.log('Error: ', err));
    }, []);

    if (loading) {
        return (<h1>Loading...</h1>);
    }

    if (!book.bookId) {
        return (
        <BookCreate
            bookId={props.match.params.id}
            loggedInName={props.user.profile.name}
            token={props.user.id_token}
            history={props.history}
        />
        );
    }

    return (
        <BookDetail
            book={book}
            loggedInName={props.user.profile.name}
            history={props.history}
            token={props.user.id_token}
        />
    );
    }

export default Books;