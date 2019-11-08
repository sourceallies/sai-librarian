import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {FaCheckCircle} from 'react-icons/fa';
import { MdDoNotDisturb } from "react-icons/md";
import documentClient from '../configuredDocumentClient';

async function getBookList() {
    return await documentClient.scan({
        TableName: process.env.REACT_APP_BOOK_TABLE
    }).promise();
}

const isAvailable = (isHere) => isHere ?
        (<label><FaCheckCircle color="#2AF598" size={16} /> Available </label>) :
        (<label><MdDoNotDisturb color="#FF0000" size={16} /> Not Available </label>);

const BookLink = (props) => {
    const {bookId, title, shelf, isAvailable: available } = props.book;
    return (
        <div>
            <div>
                <Link to={`/books/${bookId}`}>{title}</Link>
            </div>
            <p>
                {isAvailable(available)}
                on Shelf {shelf}
                <hr/>
            </p>
        </div>
    );
}

const BookList = () => {
    const [loading, setLoading] = useState(true);
    const [bookList, setBookList] = useState([]);

    const generateListOfBookDetails = () => bookList.map((book) =>
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

    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <div>
            <h1>Source Allies Library</h1>
            <div>
                {generateListOfBookDetails()}
            </div>
        </div>
    );
}

export default BookList;