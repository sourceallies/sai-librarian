import React from 'react';
import userManager from '../auth/user-manager';

export default ({ user }) => {
  const userName = user.profile.name;
  console.log(user);
  return (
    <div>
      <p>{userName}</p>
      <p>{JSON.stringify(user, null, 2)}</p>
      <p>HI!</p>
    </div>
  );
};
