import React from 'react';

const Shelf = ({onDone, shelf, title}) => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginTop: '40px'}}>
        <h3>Return {title} to Shelf {shelf}</h3>
        <div style={{textAlign: 'center'}}>
            <p>To Continue, please return the book to the provided Shelf. </p>
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <button style={{margin: 10}} onClick={onDone}>Continue</button>
        </div>
    </div>
);

export default Shelf;