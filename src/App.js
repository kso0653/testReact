import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import Hello from './Hello';
import Wrapper from "./Wrapper";
import Counter from "./Counter";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/api/hello')
        .then(response => response.text())
        .then(message => {
          setMessage(message);
        });
    },[])
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">{message}</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <Wrapper>
              <Hello name={"리액트"} color={"red"} isSpecial={true}/>
              <Hello color={"blue"}/>
          </Wrapper>
          <Counter />
      </div>
  );
}

export default App;
