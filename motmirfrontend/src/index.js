import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

export const baseUrl = 'https://motmir-api.herokuapp.com';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
