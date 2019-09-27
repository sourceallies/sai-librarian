import React from 'react';
import BookCreate from './BookCreate';
import BookDetail from './BookDetail';

function Book({ user, match }) {
  const bookExists = () => {
    console.log(user);
    console.log('run');
    return false;
    return true;
  };

  return (
    <div>
      <h3>Book ID: {match.params.id}</h3>
      {bookExists() ? (
        <BookDetail bookId={match.params.id} loggedInName={user.profile.name}/>
      ) : (
        <BookCreate bookId={match.params.id} loggedInName={user.profile.name}/>
      )}
    </div>
  );
}

export default Book;
