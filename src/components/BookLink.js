import React from 'react';
import {Link} from "react-router-dom";
import {FaCheckCircle} from 'react-icons/fa';
import { MdDoNotDisturb } from "react-icons/md";

const isAvailable = (isHere) => isHere ?
        (<label><FaCheckCircle color="#2AF598" size={16} /> Available </label>) :
        (<label><MdDoNotDisturb color="#FF0000" size={16} /> Not Available </label>);

const BookLink = (props) => {
    const {bookId, title, shelf, isAvailable: available } = props.book;
    return (
        <div>
            <div>
                <Link to={`/books/${bookId}`}>{title}</Link>
            </div>
            <p>
                {isAvailable(available)}
                on Shelf {shelf}
                <hr/>
            </p>
        </div>
    );
}

export default BookLink;