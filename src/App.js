import React from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: purple;
  color: white;
`;

const StyledAppWrapper = styled.div`
  text-align: center;
`;

const StyledAppHeader = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

function App() {
  return (
    <StyledAppWrapper>
      <StyledAppHeader>
        <img src={logo} className="App-logo" alt="logo" />
        <StyledButton>Text</StyledButton>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </StyledAppHeader>
    </StyledAppWrapper>
  );
}

export default App;
