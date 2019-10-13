import React from 'react';
import getBookList from "../utils/getBookList";
import BookLink from "./BookLink";

export default class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            bookList: []
        }
    };

    generateListOfBookDetails() {
        return this.state.bookList.map((book) =>
            <BookLink book={book} />
        );
    }

    componentDidMount() {
        getBookList().then((data) => {
            this.setState({
               loading: false,
                bookList: data.Items.sort((a, b) => {
                    if (b.title > a.title) return -1;
                    if (a.title > b.title) return 1;
                    return 0;
                })
            });
        }).catch((err) => console.log('Error: ', err));
    }

    render() {
        if (this.state.loading) {
            return <p>Loading...</p>
        }
        return (
            <div>
                <h1>Source Allies Library</h1>
                <div>
                    {this.generateListOfBookDetails()}
                </div>
            </div>
    )
    };
}
