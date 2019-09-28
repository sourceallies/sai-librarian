import React from 'react';

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

  render() {

    const { loggedInName, book } = this.props;
    return (
      <div>
        {this.state.isFetching ? (
          <h1>Loading Book...</h1>
        ) : (
          <div>
            <p>Book</p>
            <p>Book Title: {book.bookId}</p>
            <p>Book ISBN: {book.isbn}</p>
            <p>Book shelf: {book.shelf}</p>
            <p>Book Available: {book.isAvailable ? <button>Check Out</button> : <button>Check In</button>}</p>
          </div>
        )}
      </div>
    );
  }
}
