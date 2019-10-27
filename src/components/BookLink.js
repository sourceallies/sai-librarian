import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {FaCheckCircle} from 'react-icons/fa';
import { MdDoNotDisturb } from "react-icons/md";

const isAvailable = (isHere) => isHere ?
        (<label><FaCheckCircle color="#2AF598" size={16} /> Available </label>) :
        (<label><MdDoNotDisturb color="#FF0000" size={16} /> Not Available </label>);

const BookLink = (props) => {
    // Similar to AfterDetails, we're finding other unused state after switching to functional components...
    const [isFetching, setIsFetching] = useState(false);
    const [bookDetail, setBookDetail] = useState({...props.book});

        const {bookId, title, shelf, isAvailable: available } = props.book;
        return (
            <div>
                {isFetching ? (
                    <h1>Loading Book...</h1>
                ) : (
                    <>
                        <div> <Link to={`/books/${bookId}`}>{title}</Link> </div>
                        <p>
                        {isAvailable(available)}
                        on Shelf {shelf}
                        <hr/> 
                        </p>
                    </>
                )}
            </div>
        );
    }

export default BookLink;