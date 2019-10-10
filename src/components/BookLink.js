import React from 'react';
import {Link} from "react-router-dom";
import {FaCheckCircle} from 'react-icons/fa';
import { MdDoNotDisturb } from "react-icons/md";

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

    isAvailable(isHere) {
        if (isHere === true) {
            return <label><FaCheckCircle color="#2AF598" size={16} /> Available </label>
        }
        return <label><MdDoNotDisturb color="#FF0000" size={16} /> Not Available </label>
    }

    render() {
        const {bookId, title, shelf, isAvailable } = this.props.book;
        return (
            <div>
                {this.state.isFetching ? (
                    <h1>Loading Book...</h1>
                ) : (
                    <>
                        <div> <Link to={`/books/${bookId}`}>{title}</Link> </div>
                        <p>
                        {this.isAvailable(isAvailable)}
                        in Shelf {shelf}
                        <hr/> 
                        </p>
                    </>
                )}
            </div>
        );
    }
}
