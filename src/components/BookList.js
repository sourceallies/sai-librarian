import React from 'react';
import {getBookList} from "../utils/getBookList";
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
        getBookList(this.props.user.id_token).then((data) => {
            this.setState({
               loading: false,
                bookList: data.Items
            });
        }).catch((err) => console.log('Error: ', err));
    }

    render() {
        if (this.state.loading) {
            return <p>Loading</p>
        }
        return this.generateListOfBookDetails()
    };
}
