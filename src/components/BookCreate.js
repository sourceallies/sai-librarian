import React, {useState} from 'react';
import documentClient from '../configuredDocumentClient';

const BookCreate = ({match, history}) => {
    const [book, setbook] = useState({
        bookId: match.params.id,
        title: '',
        isbn: '',
        shelf: '',
    });

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setbook((prevState) => {
            return {
                ...prevState,
                [name]: value
            };
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await documentClient.put({
            TableName: process.env.REACT_APP_BOOK_TABLE,
            Item: book
        }).promise();

        history.push(`/books/${book.bookId}`);
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1> Book Information </h1>

            <label>
                Title
                <small>Enter the book&apos;s title </small>
                <input
                    name="title"
                    type="text"
                    placeholder="The Senior Software Engineer"
                    value={book.bookTitle}
                    onChange={handleInputChange}
                />
            </label>

            <label>
                ISBN
                <small>Enter the book&apos;s 10 or 13 digit code number </small>
                <input
                    name="isbn"
                    type="text"
                    placeholder="978-0990702801"
                    value={book.isbnNumber}
                    onChange={handleInputChange}
                />
            </label>

            <label>
                Shelf
                <small>Enter which Shelf you will be placing the book on</small>
                <input
                    name="shelf"
                    type="text"
                    placeholder="A1"
                    value={book.shelf}
                    onChange={handleInputChange}
                />
            </label>

            <button type="submit">Add book</button>
        </form>
    );
}

export default BookCreate;