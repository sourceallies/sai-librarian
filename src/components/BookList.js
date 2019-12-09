import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import { MdDoNotDisturb, MdCheckCircle } from "react-icons/md";
import documentClient from '../configuredDocumentClient';
import styles from './BookList.module.css';

const AvailablilityIcon = ({checkedOutBy}) => {
    if (checkedOutBy) {
        return <div className={styles.checkedOutIcon} title="Not Available"><MdDoNotDisturb/></div>;
    }
    return <div className={styles.availableIcon} title="Available"><MdCheckCircle/></div>;
}

const BookLink = (props) => {
    const { bookId, title, checkedOutBy } = props.book;
    return (
        <li className={styles.listItem}>
            <AvailablilityIcon checkedOutBy={checkedOutBy} />
            <Link to={`/books/${bookId}`} className={styles.bookLink}>{title}</Link>
        </li>
    );
}

const BookList = () => {
    const [loading, setLoading] = useState(true);
    const [bookList, setBookList] = useState([]);

    const generateListOfBookDetails = () => bookList.map((book) =>
        <BookLink key={book.bookId} book={book} />
    );

    useEffect(() => {
        async function getBooks() {
            let ExclusiveStartKey = undefined;
            do {
                const result = await documentClient.scan({
                    TableName: process.env.REACT_APP_BOOK_TABLE,
                    ExclusiveStartKey
                }).promise();

                setBookList((books) => [...books, ...result.Items]);
                ExclusiveStartKey = result.LastEvaluatedKey;
            } while (ExclusiveStartKey);
            setLoading(false);
        }

        getBooks().catch((err) => console.log('Error: ', err));
    }, []);

    return (
        <main>
            <h1 className={styles.heading}>Source Allies Library</h1>
            <ul className={styles.bookList}>
                {generateListOfBookDetails()}
            </ul>
            {loading && <div className={styles.loading}>Loading...</div>}
        </main>
    );
}

export default BookList;