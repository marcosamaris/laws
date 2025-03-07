import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
// import './index.css';
import {App} from './App.jsx';
import NavBar from './components/NavBar.jsx'
import reportWebVitals from './reportWebVitals.jsx';

ReactDOM.render(
  <Router>
    <NavBar/>
    <App />
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
