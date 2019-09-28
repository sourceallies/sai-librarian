import React from 'react';
import {postBook} from '../utils/postBook';
import BookAddSuccess from './BookAddSuccess';

export default class BookCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookTitle: '',
            complete: false,isbnNumber: '',
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
        const {loggedInName, bookId} = this.props;
        if (this.state.complete) {
      return <BookAddSuccess history={this.props.history} title={this.state.bookTitle} />;
    }return (
            <form onSubmit={this.handleSubmit}>
                <table>
                    <tr>
                        <td>
                            <label>Title</label>
                        </td>
                        <td>
                            <input
                                name="bookTitle"
                                type="text"
                                placeholder="Book Title"
                                value={this.state.bookTitle}
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>ISBN</label>
                        </td>
                        <td>
                            <input
                                name="isbnNumber"
                                type="text"
                                placeholder="978-3-16-148410-0"
                                value={this.state.isbnNumber}
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Shelf</label>
                        </td>
                        <td>
                            <input
                                name="shelf"
                                type="text"
                                placeholder="A1"
                                value={this.state.shelf}
                                onChange={this.handleInputChange}
                            />
                        </td>
                    </tr>
                </table>
                <br/>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}
