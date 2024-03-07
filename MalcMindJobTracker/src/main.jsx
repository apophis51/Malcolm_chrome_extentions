import React from 'react'
// import ReactDOM from 'react-dom/client'
import Buttons from './React Components/Buttons.jsx'
// import './index.css'
 import  {createRoot} from 'react-dom/client'





import * as buttonUtils from './VanillaUtils/buttonUtils.js';

// let exportData = {}



function handleClick(event) {

  let reactElement = document.createElement('div');
  reactElement
reactElement.className = 'React-Component';

// ReactDOM.createRoot(reactElement).render(
//   <React.StrictMode>
//     <Buttons />
//   </React.StrictMode>,
// )
let reactInstance = createRoot(reactElement)

  // Get the target node that was clicked
  var clickedNode = event.target;
  clickedNode.style.backgroundColor = 'lightyellow';
  let documentText = clickedNode.textContent
// Create a container div for the buttons
var buttonContainer = document.createElement('div');
buttonContainer.className = 'button-container';

var buttonRemove = buttonUtils.removeButton(buttonContainer);
buttonRemove.style.backgroundColor = 'lightgreen';
var button1 = buttonUtils.createButton('Job_Title', clickedNode.textContent);
button1.style.backgroundColor = 'lightblue';
var button2 = buttonUtils.createButton('Company', clickedNode.textContent);
var button3 = buttonUtils.createButton('Job_Description', clickedNode.textContent);
let button4 = buttonUtils.saveButton()

// Append buttons to the container
buttonContainer.appendChild(button1);
buttonContainer.appendChild(button2);
buttonContainer.appendChild(button3);
buttonContainer.appendChild(button4);
buttonContainer.appendChild(buttonRemove);
buttonContainer.appendChild(reactElement)




reactInstance.render(
  <React.StrictMode>
    <Buttons test={documentText}/>
  </React.StrictMode>,
)






// Insert the container above the clicked node
console.log(clickedNode.textContent)
if(
  clickedNode.textContent != 'Job Title' &&  clickedNode.textContent != 'Company' && clickedNode.textContent != 'Description' && clickedNode.textContent != 'Save' && clickedNode.textContent != 'Remove Buttons'){
clickedNode.parentNode.insertBefore(buttonContainer, clickedNode);
}


// Disable all links within the clicked node
var links = clickedNode.querySelectorAll('a');
links.forEach(function(link) {
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
children.forEach(function(child) {
   child.style.border = '2px solid red';
});

// Reset the background color of other nodes (if any)
// var allNodes = document.querySelectorAll('*');
// allNodes.forEach(function(node) {
//     if (node !== clickedNode) {
//         node.style.backgroundColor = ''; // Reset to default or remove this line to keep the previous background
//     }
// });

  // Reset the background color of other nodes (if any)
  // var allNodes = document.querySelectorAll('*');
  // allNodes.forEach(function(node) {
  //     if (node !== clickedNode) {
  //         node.style.backgroundColor = ''; // Reset to default or remove this line to keep the previous background
  //     }
}

// Add a click event listener to the document
document.addEventListener('click', handleClick);




