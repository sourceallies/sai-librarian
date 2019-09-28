import React from 'react';
import {postBook} from '../utils/postBook';

export default class BookCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookTitle: '',
      isbnNumber: '',
      shelf: '',
      'loggedInName': this.props.loggedInName,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    postBook({
      bookId: this.props.bookId,
      title: this.state.bookTitle,
      isbn: this.state.isbnNumber,
      shelf: this.state.shelf
    }, this.props.token)
    .then(() => this.props.history.push('/success'))
    .catch(err => console.log('Error: ', err));
  }

  render() {
    const { loggedInName, bookId } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Title:
          <input
            name="bookTitle"
            type="text"
            placeholder="Book Title"
            value={this.state.bookTitle}
            onChange={this.handleInputChange}
          />
        </label>
        <br />
        <label>
          ISBN:
          <input
            name="isbnNumber"
            type="text"
            placeholder="978-3-16-148410-0"
            value={this.state.isbnNumber}
            onChange={this.handleInputChange}
          />
        </label>
        <br />
        <label>
          Shelf:
          <input
            name="shelf"
            type="text"
            placeholder="A1"
            value={this.state.shelf}
            onChange={this.handleInputChange}
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
