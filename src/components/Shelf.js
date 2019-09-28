import React from 'react';

const Shelf = ({onCancel, onDone, shelf, title}) => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
        <p>Return {title} to shelf {shelf}</p>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <button style={{margin: 4}} onClick={onCancel}>Cancel</button>
            <button style={{margin: 4}} onClick={onDone}>Done</button>
        </div>
    </div>
);

export default Shelf;