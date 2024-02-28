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

function handleClick(event) {
    // Get the target node that was clicked
    var clickedNode = event.target;

    // Log the clicked node to the console
    console.log("Clicked Node:", clickedNode.textContent);

clickedNode.style.backgroundColor = 'lightyellow';

    // Reset the background color of other nodes (if any)
    // var allNodes = document.querySelectorAll('*');
    // allNodes.forEach(function(node) {
    //     if (node !== clickedNode) {
    //         node.style.backgroundColor = ''; // Reset to default or remove this line to keep the previous background
    //     }
}

// Add a click event listener to the document
document.addEventListener('click', handleClick);