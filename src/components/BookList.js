import React, {useState, useEffect} from 'react';
import getBookList from "../utils/getBookList";
import BookLink from "./BookLink";

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