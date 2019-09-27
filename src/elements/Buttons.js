import React from 'react';
import styled from 'styled-components';

export const RaisedButton = styled.button`
  background-color: #a4c639;
  color: #ffffff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);

  &:active {
    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.4);
  }
`;