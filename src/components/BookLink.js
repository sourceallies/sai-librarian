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

    isAvailable(isHere) {
        if (isHere === true) {
            return <td><div className='available'>√</div></td>
        }
        return <td><div className='not-available'>X</div></td>
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
