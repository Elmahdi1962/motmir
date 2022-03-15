import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

export const baseUrl = 'http://192.168.1.5:5000'; //'https://motmir-api.herokuapp.com'
export const imagesUrl = 'https://ik.imagekit.io/motmir/';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
