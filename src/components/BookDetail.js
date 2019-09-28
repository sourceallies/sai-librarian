import React from 'react';
import {updateBook} from "../utils/updateBook";
import AfterDetails from './AfterDetails';

export default class BookDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            complete: false,
            isFetching: false,
            bookDetail: {
                ...props.book
            }
        };
    }

    flipStatus() {
        const {isAvailable} = this.state.bookDetail;
        const newBook = {
            ...this.state.bookDetail,
            isAvailable: !isAvailable,
            neckOfTheWoods: isAvailable ? this.props.loggedInName : 'Library'
        };
        updateBook(newBook, this.props.token)
            .then(() => {
                this.setState({
                    ...this.state,
                    bookDetail: newBook,
                    complete: true
                })
            })
            .catch((err) => console.log('Error: ', err))
    }

    render() {
        const {book} = this.props;
        const {bookDetail} = this.state;
        if (this.state.complete) {
            return <AfterDetails 
                        title={this.state.bookDetail.title}
                        isReturning={this.state.bookDetail.isAvailable}
                        history={this.props.history}
                    />
        }
        return (
            <div>
                {this.state.isFetching ? (
                    <h1>Loading Book...</h1>
                ) : (
                    <table>
                        <tr>
                            <td>Book Title:</td>
                            <td>{book.title}</td>
                        </tr>
                        <tr>
                            <td>Book ISBN:</td>
                            <td>{book.isbn}</td>
                        </tr>
                        <tr>
                            <td>Book shelf:</td>
                            <td>{book.shelf}</td>
                        </tr>
                        <tr>
                            <td>Location:</td>
                            <td>{bookDetail.neckOfTheWoods}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button
                                    onClick={() => this.flipStatus()}
                                    style={bookDetail.isAvailable ? {} : {background: '#EF5350'}}
                                >
                                    {bookDetail.isAvailable ? 'Check Out' : 'Return'}
                                </button>
                            </td>
                        </tr>
                    </table>
                )}
            </div>
        );
    }
}
