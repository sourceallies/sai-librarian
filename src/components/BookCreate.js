import React from 'react';
import {postBook} from '../utils/postBook';
import BookAddSuccess from './BookAddSuccess';

export default class BookCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookTitle: '',
            complete: false,
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
            .then(() => this.setState({complete: true}))
            .catch(err => console.log('Error: ', err));
    }

    render() {
        if (this.state.complete) {
          return <BookAddSuccess history={this.props.history} title={this.state.bookTitle} />;
        }
      return (
            <form onSubmit={this.handleSubmit}>
                <h1> Book Information </h1>
                <hr/>
                <table>
                    <tr>
                        <h4>Title</h4>
                        <h5>Enter the book's title </h5>
                        <input
                            name="bookTitle"
                            type="text"
                            placeholder="The Senior Software Engineer"
                            value={this.state.bookTitle}
                            onChange={this.handleInputChange}
                        />
                    </tr>
                    <tr>
                        <h4>ISBN</h4>
                        <h5>Enter the book's 10 or 13 digit code number </h5>
                        <input
                            name="isbnNumber"
                            type="text"
                            placeholder="978-0990702801" 
                            value={this.state.isbnNumber}
                            onChange={this.handleInputChange}
                        />
                    </tr>
                    <tr>
                        <h4>Shelf</h4>
                        <h5>Enter which Shelf you will be placing the book on</h5>
                        <input
                            name="shelf"
                            type="text"
                            placeholder="A1"
                            value={this.state.shelf}
                            onChange={this.handleInputChange}
                        />
                    </tr>
                </table>
                <input type="submit" value="Add book"/>
            </form>
        );
    }
}
