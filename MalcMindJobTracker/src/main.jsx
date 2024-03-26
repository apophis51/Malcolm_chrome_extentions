import React from 'react'
// import ReactDOM from 'react-dom/client'
import Buttons from './React Components/Buttons.jsx'
import NavBar from './React Components/NavBar.jsx'
import { createRoot } from 'react-dom/client'
import * as buttonUtils from './VanillaUtils/buttonUtils.js';
import ApplicationTracker from './React Components/ApplicationTracker.jsx'

import AppConfig from './AppConfig.jsx';

async function main() {


  let disabled = false

  if (sessionStorage.getItem('token') == null) {
    sessionStorage.setItem('token', 'abc123');
  }
  else {
    console.log('token already present')
  }
  let storedToken = sessionStorage.getItem('token');
  console.log('sessionStorage:', storedToken);

  let disableStatus = await AppConfig().disableStatus()  //
  let storageStatusID = await AppConfig().idStatus()  //
  console.log('Disabled Status', disableStatus)
  console.log('Storage Status ID', storageStatusID)

  try {
    if (storageStatusID == undefined) {
      await AppConfig().generateID()
      console.log(await AppConfig().idStatus())
    }
  }
  catch { console.log('generateID failed') }
  // if(storageStatusID)
  // {
  //   await AppConfig().clearStorage()  //
  // }






  console.log('checkpoint2')

  if (disableStatus != undefined) {
    // if (disableStatus == "true" || disableStatus.disabled == "true") {
    if (disableStatus == "true") {

      disabled = true
    }
    else {
      disabled = false
    }
  }
  console.log("disabled status", disabled)
  console.log('checkpoint3')

  async function disable() {
    console.log('disabled')
    disabled = true
    await AppConfig().storageDisableTrue()  //
    console.log('localStorage:', disableStatus)
  }

  async function enable() {
    console.log('enabled')
    disabled = false
    await AppConfig().storageDisableFalse() //
    console.log('localStorage:', disableStatus)
    console.log(disabled)
  }

  let myButtons = [
    "Job Title",
    "Job_Title",
    "Job_Description",
    "test",
    "Title",
    "Company",
    "Description",
    "Save",
    "Remove Buttons",
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
      <NavBar disable={disable} enable={enable} />
    </React.StrictMode>,
  )

  let applicationDiv = document.createElement('div');
  let applicationInstance = createRoot(applicationDiv)
  documentBody.prepend(applicationDiv)
  applicationInstance.render(
    <React.StrictMode>
      <ApplicationTracker />
    </React.StrictMode>,
  )

  function handleClick(event) {
    console.log(window.getSelection().toString().trim())

    ///  remove last buttons guard
    if (!myButtons.includes(event.target.textContent) && !event.target.parentNode.classList.contains('dontTrack')) {
      let removeButtons = document.querySelectorAll('.button-container');
      removeButtons.forEach(function (button) {
        button.remove();
      });
    }
    ///// end remove last buttons guard


    let reactElement = document.createElement('div');
    reactElement.className = 'React-Component';
    let reactInstance = createRoot(reactElement)

    // Get the target node that was clicked
    var clickedNode = event.target;
    let documentText = clickedNode.textContent


    ///a recursive function that traverses the DOM hierarchy.
    //gpt prompt how do i search through all parrent nodes in the dom to see if any contains a specific classname?


    function hasParentWithClass(element, className) {
      // Base case: if the element is null or undefined, return false
      if (!element) {
        return false;
      }
      // Check if the current element has the specified class
      try {
        if (element.classList.contains(className)) {
          return true;
        }
      }
      catch { }

      // Recursively check the parent node
      return hasParentWithClass(element.parentNode, className);
    }
    let hasParrentWithClassResult = hasParentWithClass(clickedNode, 'dontTrack')
    console.log('track node', hasParrentWithClassResult)
    ///End Test Function
    ///////////////////////////////////////////// Light Yellow Function

    if (!(myButtons.includes(clickedNode.textContent) || clickedNode.classList.contains('dontTrack') || hasParrentWithClassResult)) {
      if (disabled == false) {
        clickedNode.style.backgroundColor = 'lightyellow';
      }
    }
    console.log(clickedNode.parentNode.classList)
    console.log(clickedNode.parentNode.classList.contains('card'))
    console.log(clickedNode.parentNode.classList.contains('dontTrack'))
    if (lastClickedNode !== null && lastClickedNode.className !== 'card draggable resizable' && !myButtons.includes(event.target.textContent) && !clickedNode.parentNode.classList.contains('card') && !clickedNode.parentNode.classList.contains('dontTrack')) {
      console.log('triggered')
      lastClickedNode.style.backgroundColor = ''; // Set it to the default or any desired color
    }
    if (!myButtons.includes(event.target.textContent) && !clickedNode.parentNode.classList.contains('dontTrack')) {
      lastClickedNode = clickedNode; // Store the clicked node
    }
    ////////////////////////////////////////////////////////////////////////////////////////////

    // Create a container div for the buttons
    var buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    ///////////////////////////////////////// Vanilla Javascript Buttons Function Depreciated
    // var buttonRemove = buttonUtils.removeButton(buttonContainer);
    // buttonRemove.style.backgroundColor = 'lightgreen';
    // var button1 = buttonUtils.createButton('Job_Title', clickedNode.textContent);
    // button1.style.backgroundColor = 'lightblue';
    // var button2 = buttonUtils.createButton('Company', clickedNode.textContent);
    // var button3 = buttonUtils.createButton('Job_Description', clickedNode.textContent);
    // let button4 = buttonUtils.saveButton()
    // buttonContainer.appendChild(button1);
    // buttonContainer.appendChild(button2);
    // buttonContainer.appendChild(buttonRemove);
    ////////////////////////////////////////
    buttonContainer.appendChild(reactElement)




    reactInstance.render(
      <React.StrictMode>
        <Buttons documentText={documentText} disable={disable} />
      </React.StrictMode>,
    )






    // Insert the container above the clicked node
    console.log(clickedNode.textContent)
    console.log(clickedNode.className)
    console.log(clickedNode.classList)
    console.log(clickedNode.parentNode.classList.contains('card'))
    console.log(clickedNode.closest('card'))
    if (!myButtons.includes(clickedNode.textContent) && clickedNode.className !== 'card draggable resizable' && !clickedNode.parentNode.classList.contains('card') && !clickedNode.classList.contains('dontTrack') && !hasParrentWithClassResult) {
      if (disabled == false) {
        clickedNode.parentNode.insertBefore(buttonContainer, clickedNode);
      }
    }


    // Disable all links within the document
    if (disabled == false) {
      console.log('this is ran')
      // var links = clickedNode.querySelectorAll('a');
      var links = document.querySelectorAll('a')
      links.forEach(function (link) {
        link.style.pointerEvents = 'none';
      });
    }
    if (disabled == true) {
      var links = document.querySelectorAll('a')
      links.forEach(function (link) {
        link.style.pointerEvents = 'auto';
      });
    }


    if (disabled == false) {
      console.log('triggered')
      let children = document.querySelectorAll('*');
      children.forEach(function (child) {
        child.addEventListener('mouseenter', function () {
          child.style.boxShadow = '0 0 10px rgba(0, 0, 700, 0.6)'; // Apply box shadow on hover
        });
        child.addEventListener('mouseleave', function () {
          child.style.boxShadow = 'none'; // Remove box shadow when not hovering
        });
      });

    }
    if (disabled == true) {
      let children = document.querySelectorAll('*');
      children.forEach(function (child) {
        child.style.border = '';
        child.addEventListener('mouseenter', function () {
          child.style.boxShadow = 'none';
        });
      });
    }




    // Reset the background color of other nodes (if any)
    // var allNodes = document.querySelectorAll('*');
    // allNodes.forEach(function(node) {
    //     if (node !== clickedNode) {
    //         node.style.backgroundColor = ''; // Reset to default or remove this line to keep the previous background
    //     }
    // });
    console.log(disabled)

    // Add a red border to all children of the clicked node unless we don't want to track that node
    // if (disabled == false && !clickedNode.classList.contains('dontTrack') && !hasParrentWithClassResult){
    //   var children = clickedNode.querySelectorAll('*');
    //   children.forEach(function (child) {
    //     child.style.border = '1px solid black';


    //     child.addEventListener('mouseenter', function() {
    //       child.style.boxShadow = '0 0 10px rgba(0, 0, 600, 0.6)'; // Apply box shadow on hover
    //   });
    //   child.addEventListener('mouseleave', function() {
    //       child.style.boxShadow = 'none'; // Remove box shadow when not hovering
    //   });
    //   });
    // }
  }

  // Add a click event listener to the document
  document.addEventListener('click', handleClick);





}
main()