import React from 'react';
import {Link} from "react-router-dom";
import '../App.css';

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

    isAvailable(location) {
        if (location === "Library") {
            return "A"
        }
        return "NA"
    }

    render() {
        const {bookId, title, shelf, location } = this.props.book;
        return (
            <tr>
                {this.state.isFetching ? (
                    <td>Loading Book...</td>
                ) : (
                    <>
                        <td><Link to={`/books/${bookId}`}>{title}</Link></td>
                        <td>{shelf}</td>
                        <td>{this.isAvailable(location)}</td>
                    </>
                )}
            </tr>
        );
    }
}
