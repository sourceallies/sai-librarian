import React, {useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom";
import { MdDoNotDisturb, MdCheckCircle, MdSearch } from "react-icons/md";
import documentClient from '../configuredDocumentClient';
import {useBookData} from '../utils/book-api';
import styles from './BookList.module.css';

const AvailablilityIcon = ({checkedOutBy}) => {
    if (checkedOutBy) {
        return <div className={styles.checkedOutIcon} title="Not Available"><MdDoNotDisturb/></div>;
    }
    return <div className={styles.availableIcon} title="Available"><MdCheckCircle/></div>;
}

const BookLink = (props) => {
    const { bookId, title, checkedOutBy, isbn } = props.book;
    const bookData = useBookData(isbn);

    const imageUrl = (bookData && bookData.cover) ? bookData.cover.small : '';

    return (
        <li className={styles.listItem}>
            <img src={imageUrl} alt={`Cover for ${title}`} data-testid={`${isbn}-cover`} />
            <AvailablilityIcon checkedOutBy={checkedOutBy} />
            <Link to={`/books/${bookId}`} className={styles.bookLink}>{title}</Link>
        </li>
    );
}

const BookList = () => {
    const searchInput = useRef(null);
    const [loading, setLoading] = useState(true);
    const [bookList, setBookList] = useState([]);
    const [search, setSearch] = useState('');

    const generateListOfBookDetails = () => bookList
    .filter((book) => book.title.toLowerCase().includes(search.toLowerCase()))
    .map((book) =>
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

    useEffect(() => {
        if (searchInput && searchInput.current) {
            searchInput.current.focus();
        }
    }, [loading])

    return (
        <main>
            <h1 className={styles.heading}>Source Allies Library</h1>
            <input className={styles.search} type="text" placeholder={'Search'} value={search} onChange={(e) => setSearch(e.target.value)} ref={searchInput} />
            <span className={styles.searchIcon} title="Search"><MdSearch/></span>
            <ul className={styles.bookList}>
                {generateListOfBookDetails()}
            </ul>
            {loading && <div className={styles.loading}>Loading...</div>}
        </main>
    );
}

export default BookList;