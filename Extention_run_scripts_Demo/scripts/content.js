// ==UserScript==
// @name        New script ziprecruiter.com
// @namespace   Violentmonkey Scripts
// @match       https://www.ziprecruiter.com/jobs-search*
// @grant       none
// @version     1.0
// @author      -
// @description 1/25/2024, 12:18:06 PM
// ==/UserScript==
//         let buttons = document.querySelectorAll('button');

// console.log(buttons)

// let result = null
// for (let x of buttons){
//   if (x.textContent == '1-Click Apply'){
//     console.log('we found one')
//     console.log('the parrents parrent is',(x.parentNode.parentNode))
// console.log('the parrents parrent parrent is',(x.parentNode.parentNode.parentNode))
// console.log('text is',(x.parentNode.parentNode.parentNode.textContent))
//     // console.log(x.parentNode)
//   }
// }

// import {test} from './test.js'

// test()

// const {test} = require('./test.js')
// test()
// import 'global.css';



function createButton(text) {
    var button = document.createElement('button');
    button.textContent = text;
    button.className = 'button';
    // Add any additional button properties or event listeners as needed
    return button;
}

function removeButton(buttonContainer){
    var button = document.createElement('button');
    button.textContent = 'Remove Buttons';
    button.className = 'button';
    button.onclick = function() {
        buttonContainer.remove()
    }
    // Add any additional button properties or event listeners as needed
    return button;
} 

function handleClick(event) {
    // Get the target node that was clicked
    var clickedNode = event.target;

    // Log the clicked node to the console
    console.log("Clicked Node:", clickedNode.textContent);

clickedNode.style.backgroundColor = 'lightyellow';
// Create buttons
var button1 = createButton('Button 1');
button1.style.backgroundColor = 'lightgreen';
var button2 = createButton('Button 2');
var button3 = createButton('Button 3');


// Create a container div for the buttons
var buttonContainer = document.createElement('div');
buttonContainer.className = 'button-container';

var buttonRemove = removeButton(buttonContainer);

// Append buttons to the container
buttonContainer.appendChild(button1);
buttonContainer.appendChild(button2);
buttonContainer.appendChild(button3);
buttonContainer.appendChild(buttonRemove);

// Insert the container above the clicked node
clickedNode.parentNode.insertBefore(buttonContainer, clickedNode);



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
urlFetcher(event.target.textContent).then((resp) => (console.log('we got it', resp)))
// urlFetche().then((resp) => console.log('we got it', resp));
}

// Add a click event listener to the document
document.addEventListener('click', handleClick);
urlFetcher()


function urlFetche() {
// Example function; replace with your actual implementation
return fetch('https://example.com/api/data')
.then(response => response.json());
}

async function urlFetcher(dataa){
console.log('dataa',  dataa)
try{
const url = "http://localhost:3000/WorkSearchApp/api"
// let data = {server: "echo me biiatch"}
let data =  {server: dataa}
let echo = await fetch(url, {
method: 'POST',
headers: {
'Content-Type': 'application/json' // Set the content type if you're sending JSON data
// Add any other headers as needed
},
body: JSON.stringify(data) // Convert the data to a JSON string
})
let echoResponse = await echo.json()

// let response = await fetch(url)
// let resolve = await response.json()
//   console.log(resolve.data)
console.log('eechoresponse', echoResponse)
// return echoResponse

}
catch(error){
console.log('we have an error', error)
return(error)
}
}
