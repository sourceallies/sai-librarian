import React from 'react';
import {FaCheckCircle} from 'react-icons/fa';

const BookAddSuccess = ({history, title = "Steve"}) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
            <FaCheckCircle color="green" size={50} />
            <p>{title} has been added!</p>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <button style={{fontSize: 14, margin: 4}} onClick={() => history.push('/another')}>Add Another</button>
                <button style={{fontSize: 14, margin: 4}} onClick={() => history.push('/books')}>Continue to library</button>
            </div>
            <p>If you are done close the tab or app</p>
        </div>)
}

export default BookAddSuccess;