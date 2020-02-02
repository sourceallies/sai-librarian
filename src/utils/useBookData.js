import {useEffect, useState} from 'react';
import {getBookData} from './book-api';

export function useBookData(isbn) {
    const [bookData, setBookData] = useState({});

    useEffect(() => {
        if (isbn) {
            getBookData(isbn)
                .then((book) => setBookData(book))
                .catch((error) => {
                    console.error(`There was an issue fetching ISBN:${isbn} from the books api.`, error);
                });
        } else {
            setBookData({});
        }
    }, [isbn, setBookData]);

    return bookData;
}