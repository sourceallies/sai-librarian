import React from 'react';

export default ({ user }) => {
  const userName = user.profile.name;
  console.log(user);
  return (
    <div>
      <p>{userName}</p>
      <p>HI!</p>
    </div>
  );
};
