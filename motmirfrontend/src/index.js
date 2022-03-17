import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

export const baseUrl = 'https://motmir-api.herokuapp.com'; //'http://localhost:5000'
export const imagesUrl = 'https://ik.imagekit.io/motmir/';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
