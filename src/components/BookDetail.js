import React from 'react';

export default class BookDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      bookDetail: {
        bookTitle: 'Start',
        isbnNumber: 'Here',
        shelf: '00',
        loggedInName: this.props.loggedInName
      }
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.fetchBook(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  fetchBook() {
    const bookDetail = {
      bookTitle: 'Apples Rule the World',
      isbnNumber: '978-3-16-148410-0',
      shelf: 'C3',
      loggedInName: this.props.loggedInName
    };
    this.setState({ ...this.state, isFetching: true });
    this.setState({ bookDetail: bookDetail, isFetching: false });
    console.log(this.state);
  }

  render() {
    const bookAvailable = () => {
      return false;
      return true;
    };

    const { loggedInName, bookId } = this.props;
    return (
      <div>
        {this.state.isFetching ? (
          <h1>Loading Book...</h1>
        ) : (
          <div>
            <p>Book</p>
            <p>Book Title: {this.state.bookDetail.bookTitle}</p>
            <p>Book ISBN: {this.state.bookDetail.isbnNumber}</p>
            <p>Book shelf: {this.state.bookDetail.shelf}</p>
            <p>Book Available: {bookAvailable() ? <button>Check Out</button> : <button>Check In</button>}</p>
          </div>
        )}
      </div>
    );
  }
}
