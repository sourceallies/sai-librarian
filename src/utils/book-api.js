import {useEffect, useState} from 'react';

export async function getBookData(isbn) {
    const searchParams = new URLSearchParams();
    searchParams.set('bibkeys', `ISBN:${isbn}`);
    searchParams.set('jscmd', 'data');
    searchParams.set('format', 'json');
    const response = await fetch(`/api/books?${searchParams}`, {
        headers: {
            'accept': 'application/json'
        }
    });
    if (response.ok) {
        const body = await response.json();

        return body[`ISBN:${isbn}`];
    }
    if (response.status === 404) {
        return {};
    }
    throw new Error('Error: ' + response.status);
}

export function useBookData(isbn) {
    const [bookData, setBookData] = useState({});

    useEffect(() => {
        if (isbn) {
            getBookData(isbn)
                .then((book) => setBookData(book))
                .catch((error) => {
                    console.error(`There was an issue fetching ${isbn} from the books api. ISBN: ${isbn}`, error);
                });
        } else {
            setBookData({});
        }
    }, [isbn, setBookData]);

    return bookData;
}