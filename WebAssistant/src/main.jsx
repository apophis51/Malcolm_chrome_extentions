import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'


// Create a new element
const newElement = document.createElement('div');
newElement.className = 'cool';
// newElement.style = 'color: red;'
newElement.style = ' position: fixed ; bottom: 10vh; right: 10vw; z-index: 12;background-color: blueviolet;'


ReactDOM.createRoot(newElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Append the new element to the body
document.body.appendChild(newElement);



