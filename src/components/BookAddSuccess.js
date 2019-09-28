import React from 'react';

const BookAddSuccess = ({history, title = "Steve"}) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
            <p>{title} has been added!</p>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <button onClick={() => history.push('/another')}>Add Another</button>
                <button onClick={() => history.push('/books')}>Continue to library</button>
            </div>
            <p>If you are done close the tab or app</p>
        </div>)
}

export default BookAddSuccess;