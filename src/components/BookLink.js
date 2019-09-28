import React from 'react';
import {Link} from "react-router-dom";

export default class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            bookDetail: {
                ...props.book
            }
        };
    }

    render() {
        const {bookId, title, shelf } = this.props.book;
        return (
            <div>
                {this.state.isFetching ? (
                    <h1>Loading Book...</h1>
                ) : (
                    <div>
                        <p><Link to={`/books/${bookId}`}>{title}</Link> Book shelf: {shelf}</p>
                    </div>
                )}
            </div>
        );
    }
}
