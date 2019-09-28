import React from 'react';
import {updateBook} from "../utils/updateBook";

export default class BookDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    updateBook(newBook)
        .then(() => {
          this.setState({
            ...this.state,
            bookDetail: newBook
          })
        })
        .catch((err) => console.log('Error: ', err))
  }

  render() {

    const { book } = this.props;
    const { bookDetail } = this.state;
    return (
      <div>
        {this.state.isFetching ? (
          <h1>Loading Book...</h1>
        ) : (
          <div>
            <p>Book</p>
            <p>Book Title: {book.title}</p>
            <p>Book ISBN: {book.isbn}</p>
            <p>Book shelf: {book.shelf}</p>
            <p>Location: {bookDetail.neckOfTheWoods}</p>
            <p>Book Available: <button onClick={() => this.flipStatus()}>{bookDetail.isAvailable ? 'Check Out' : 'Check In'}</button></p>
          </div>
        )}
      </div>
    );
  }
}
