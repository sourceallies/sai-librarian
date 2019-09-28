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
            return <td><FaCheckCircle color="green" size={20} /></td>
        }
        return <td><MdDoNotDisturb color="red" size={20} /></td>
    }

    render() {
        const {bookId, title, shelf, isAvailable } = this.props.book;
        return (
            <tr>
                {this.state.isFetching ? (
                    <td>Loading Book...</td>
                ) : (
                    <>
                        <td><Link to={`/books/${bookId}`}>{title}</Link></td>
                        <td>{shelf}</td>
                        {this.isAvailable(isAvailable)}
                    </>
                )}
            </tr>
        );
    }
}
