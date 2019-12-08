import React, {useState, useEffect, useRef} from 'react';
import {Link} from "react-router-dom";
import { MdDoNotDisturb, MdCheckCircle, MdSearch } from "react-icons/md";
import documentClient from '../configuredDocumentClient';
import styles from './BookList.module.css';

async function getBookList() {
    return await documentClient.scan({
        TableName: process.env.REACT_APP_BOOK_TABLE
    }).promise();
}

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
        getBookList().then((data) => {
            setBookList(data.Items.sort((a, b) => {
                if (b.title > a.title) return -1;
                if (a.title > b.title) return 1;
                return 0;
            }));
            setLoading(false);
        }).catch((err) => console.log('Error: ', err));
    }, []);

    useEffect(() => {
        if (searchInput && searchInput.current) {
            searchInput.current.focus();
        }
    }, [loading])

    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <main>
            <h1 className={styles.heading}>Source Allies Library</h1>
            <input className={styles.search} type="text" placeholder={'Search'} value={search} onChange={(e) => setSearch(e.target.value)} ref={searchInput} />
            <span className={styles.searchIcon} title="Serach"><MdSearch/></span>
            <ul className={styles.bookList}>
                {generateListOfBookDetails()}
            </ul>
        </main>
    );
}

export default BookList;