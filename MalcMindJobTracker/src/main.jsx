import React from 'react'
// import ReactDOM from 'react-dom/client'
import Buttons from './React Components/Buttons.jsx'
import NavBar from './React Components/NavBar.jsx'
// import './index.css'
import { createRoot } from 'react-dom/client'
import * as buttonUtils from './VanillaUtils/buttonUtils.js';


let myButtons = [
  "Job Title",
  "Company",
  "Description",
  "Save",
  "Remove Buttons",
  "Color DOM",
  "UNColor DOM",
  "Deactivate Links",
  "Reactivate Links",
  "Remove All Injected Buttons",
  "Application Tracker",
]
let lastClickedNode = null; // Variable to store the last clicked node


// let exportData = {}

let navDiv = document.createElement('div');
let navInstance = createRoot(navDiv)

let documentBody = document.querySelector('body')
documentBody.prepend(navDiv)

navInstance.render(
  <React.StrictMode>
    <NavBar />
  </React.StrictMode>,
)

function handleClick(event) {


  ///  remove last buttons guard
  let removeButtons = document.querySelectorAll('.button-container');
  removeButtons.forEach(function(button) {
      button.remove();
    });
///// end remove last buttons guard


  let reactElement = document.createElement('div');
  reactElement.className = 'React-Component';
  let reactInstance = createRoot(reactElement)

  // Get the target node that was clicked
  var clickedNode = event.target;

  ///////////////////////////////////////////// Light Yellow Function

  if (!(myButtons.includes(clickedNode.textContent)|| clickedNode.className == 'card draggable resizable')) {
    clickedNode.style.backgroundColor = 'lightyellow';
  }
  if (lastClickedNode !== null && lastClickedNode.className !== 'card draggable resizable') {
    lastClickedNode.style.backgroundColor = ''; // Set it to the default or any desired color
  }
  lastClickedNode = clickedNode; // Store the clicked node
  ////////////////////////////////////////////////////////////////////////////////////////////

  let documentText = clickedNode.textContent
  // Create a container div for the buttons
  var buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';
///////////////////////////////////////// Vanilla Javascript Buttons Function
  var buttonRemove = buttonUtils.removeButton(buttonContainer);
  buttonRemove.style.backgroundColor = 'lightgreen';
  var button1 = buttonUtils.createButton('Job_Title', clickedNode.textContent);
  button1.style.backgroundColor = 'lightblue';
  var button2 = buttonUtils.createButton('Company', clickedNode.textContent);
  var button3 = buttonUtils.createButton('Job_Description', clickedNode.textContent);
  let button4 = buttonUtils.saveButton()
  buttonContainer.appendChild(button1);
  buttonContainer.appendChild(button2);
  buttonContainer.appendChild(button3);
  buttonContainer.appendChild(button4);
  ////////////////////////////////////////
  buttonContainer.appendChild(buttonRemove);
  buttonContainer.appendChild(reactElement)




  reactInstance.render(
    <React.StrictMode>
      <Buttons test={documentText} />
    </React.StrictMode>,
  )






  // Insert the container above the clicked node
  console.log(clickedNode.textContent)
  console.log(clickedNode.className)
  console.log(clickedNode.classList)
  console.log(clickedNode.parentNode.classList.contains('card'))
  console.log(clickedNode.closest('card'))
  if (!myButtons.includes(clickedNode.textContent) && clickedNode.className !== 'card draggable resizable' && !clickedNode.parentNode.classList.contains('card') && !clickedNode.classList.contains('dontTrack')) {

    clickedNode.parentNode.insertBefore(buttonContainer, clickedNode);
  }


  // Disable all links within the clicked node
  var links = clickedNode.querySelectorAll('a');
  links.forEach(function (link) {
    link.style.pointerEvents = 'none';
  });

  // Reset the background color of other nodes (if any)
  // var allNodes = document.querySelectorAll('*');
  // allNodes.forEach(function(node) {
  //     if (node !== clickedNode) {
  //         node.style.backgroundColor = ''; // Reset to default or remove this line to keep the previous background
  //     }
  // });


  // Add a red border to all children of the clicked node
  var children = clickedNode.querySelectorAll('*');
  children.forEach(function (child) {
    child.style.border = '2px solid red';
  });
}

// Add a click event listener to the document
document.addEventListener('click', handleClick);




