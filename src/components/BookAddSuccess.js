import React from 'react';

const BookAddSuccess = ({history, title = "Steve"}) => {
    return (<div>
            <p>{title}</p>
            <p>has been added!</p>
            <button onClick={() => history.push('/another')}>Add Another</button>
            <button onClick={() => history.push('/books')}>Continue to library</button>
        </div>)
}

export default BookAddSuccess;