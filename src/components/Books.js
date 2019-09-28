import React from 'react';
import {getBookByBookId} from "../utils/getBook";
import BookDetail from "./BookDetail";
import BookCreate from "./BookCreate";

export default class Books extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            book: {}
        }
    }

    componentDidMount() {
        getBookByBookId(this.props.match.params.id, this.props.user.id_token).then((data) => {
            if (data.Item) {
                this.setState({
                    loading: false,
                    book: data.Item
                });
            } else {
                this.setState({
                    loading: false
                })
            }

        }).catch((err) => console.log('Error: ', err));

    }

    render() {
        if (this.state.loading) {
            return <p>Loading</p>
        }
        console.log('Books');
        console.log(this.props.history);
         if (!this.state.book.bookId) {
             return (
                <BookCreate 
                    bookId={this.props.match.params.id}
                    loggedInName={this.props.user.profile.name} 
                    token={this.props.user.id_token} 
                    history={this.props.history}
                />
             );
         }

        return (
            <BookDetail 
              book={this.state.book} 
              loggedInName={this.props.user.profile.name} 
              token={this.props.user.id_token}
            />
        );
    };
}
