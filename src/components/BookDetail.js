import React, {useState} from 'react';
import {updateBook} from "../utils/updateBook";
import AfterDetails from './AfterDetails';
import Shelf from './Shelf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faBan } from '@fortawesome/free-solid-svg-icons'

const fontAwesomeIconStyle = {
    paddingRight: '20px'
};

const availableHeaderStyle = {
    color: '#2AF598'
}

const unavailableHeaderStyle = {
    color: '#EF5350'
}

const AvailabilityHeader = (props) => props.isAvailable ? (
    <h2
        style={availableHeaderStyle}
    >
        <FontAwesomeIcon
            icon={faCheckCircle}
            size={20}
            style={fontAwesomeIconStyle}
        />
        {'Available'}
    </h2>
) : (
    <h2
        style={unavailableHeaderStyle}
    >
        <FontAwesomeIcon
            icon={faBan}
            size={20}
            style={fontAwesomeIconStyle}
        />
        {'Unvailable'}
    </h2>
);

const BookDetail = (props) => {
    const [bookDetail, setBookDetail] = useState({...props.book});
    const [complete, setComplete] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [shelf, setShelf] = useState(false);

   const flipStatus = () => {
        const {isAvailable} = bookDetail;
        const newBook = {
            ...bookDetail,
            isAvailable: !isAvailable,
            neckOfTheWoods: isAvailable ? props.loggedInName : 'Library'
        };
        updateBook(newBook, props.token)
            .then(() => {
                setBookDetail(newBook);
                setComplete(true);
                setShelf(!isAvailable);
            })
            .catch((err) => console.log('Error: ', err))
    }

        const {book} = props;
        if (shelf) {
            return <Shelf
                        onDone={() => setShelf(false)}
                        shelf={bookDetail.shelf}
                        title={bookDetail.title}
                    />
        }
        if (complete) {
            return <AfterDetails
                        title={bookDetail.title}
                        isReturning={bookDetail.isAvailable}
                        history={props.history}
                    />
        }
        return (
            <div>
                {isFetching ? (
                    <h1>Loading Book...</h1>
                ) : (
                    <div>
                        <header>
                            <h1>
                                {book.title}
                            </h1>
                            <hr/> 
                            <AvailabilityHeader isAvailable={bookDetail.isAvailable} />
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
                        </p>
                        <div>
                                <button
                                    onClick={flipStatus}
                                    style={bookDetail.isAvailable ? {} : {background: '#EF5350'}}
                                >
                                    {bookDetail.isAvailable ? 'Check Out' : 'Return'}
                                </button>
                            </div>
                    </div>
                )}
            </div>
        );
    }

export default BookDetail;