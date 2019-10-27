import React, {useState} from 'react';
import {postBook} from '../utils/postBook';
import BookAddSuccess from './BookAddSuccess';

const BookCreate = (props) => {
    const [bookState, setBookState] = useState({
        bookTitle: '',
        complete: false,
        isbnNumber: '',
        shelf: '',
        loggedInName: props.loggedInName,
    });

    const setState = (state) => setBookState({...bookState, state});

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setState({
            [name]: value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        postBook({
            bookId: props.bookId,
            title: bookState.bookTitle,
            isbn: bookState.isbnNumber,
            shelf: bookState.shelf
        }, props.token)
            .then(() => setState({complete: true}))
            .catch(err => console.log('Error: ', err));
    }

    if (bookState.complete) {
        return <BookAddSuccess history={props.history} title={bookState.bookTitle} />;
    }
    return (
        <form onSubmit={handleSubmit}>
            <h1> Book Information </h1>
            <hr/>
            <table>
                <tr>
                    <h4>Title</h4>
                    <h5>Enter the book&apos;s title </h5>
                    <input
                        name="bookTitle"
                        type="text"
                        placeholder="The Senior Software Engineer"
                        value={bookState.bookTitle}
                        onChange={handleInputChange}
                    />
                </tr>
                <tr>
                    <h4>ISBN</h4>
                    <h5>Enter the book&apos;s 10 or 13 digit code number </h5>
                    <input
                        name="isbnNumber"
                        type="text"
                        placeholder="978-0990702801"
                        value={bookState.isbnNumber}
                        onChange={handleInputChange}
                    />
                </tr>
                <tr>
                    <h4>Shelf</h4>
                    <h5>Enter which Shelf you will be placing the book on</h5>
                    <input
                        name="shelf"
                        type="text"
                        placeholder="A1"
                        value={bookState.shelf}
                        onChange={handleInputChange}
                    />
                </tr>
            </table>
            <input type="submit" value="Add book"/>
        </form>
    );
}

export default BookCreate;