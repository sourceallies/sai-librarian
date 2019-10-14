import React from 'react';
import {updateBook} from "../utils/updateBook";
import AfterDetails from './AfterDetails';
import Shelf from './Shelf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

const checkCircleStyle = {
    paddingRight: '20px'
};

const availableHeaderStyle = {
    color: 'green'
}

export default class BookDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookDetail: {
                ...props.book
            },
            complete: false,
            isFetching: false,
            shelf: false
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
                    complete: true,
                    shelf: !isAvailable
                })
            })
            .catch((err) => console.log('Error: ', err))
    }

    render() {
        const {book} = this.props;
        const {bookDetail} = this.state;
        if (this.state.shelf) {
            return <Shelf
                        onDone={() => this.setState({shelf: false})}
                        shelf={this.state.bookDetail.shelf}
                        title={this.state.bookDetail.title}
                    />
        }
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
                    <div>
                        <header>
                            <h1>
                                {book.title}
                            </h1>
                            <h2
                                style={availableHeaderStyle}
                            >
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    size={"1x"}
                                    color={"green"}
                                    style={checkCircleStyle}
                                />
                                {'Available'}
                            </h2>
                        </header>
                        <p>
                            <div>
                                <label
                                    style={{paddingRight: '20px'}}
                                >
                                    Book Shelf:
                                </label>
                                {book.shelf}
                            </div>
                            <div>
                                <label
                                    style={{paddingRight: '20px'}}
                                >
                                    Book ISBN:
                                </label>
                                {book.isbn}
                            </div>
                            <div>
                                <button
                                    onClick={() => this.flipStatus()}
                                    style={bookDetail.isAvailable ? {} : {background: '#EF5350'}}
                                >
                                    {bookDetail.isAvailable ? 'Check Out' : 'Return'}
                                </button>
                            </div>
                        </p>
                    </div>
                )}
            </div>
        );
    }
}
