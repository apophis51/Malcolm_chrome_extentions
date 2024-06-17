//code smell delete env variables before shipping to production


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React from 'react'
import '../index.css'
import { atom, useAtom,useAtomValue } from 'jotai'
import {  exportData, postingUrlSet } from './Atoms.js'
import  AppConfig  from '../AppConfig.jsx'



import { useRef, useEffect, useMemo, useState } from 'react';  //new

// export default function Buttons({test}) {
//     const shadowRef = useRef();

//   useEffect(() => {
//     const shadow = shadowRef.current.attachShadow({ mode: 'open' });

//     // Create your Shadow DOM content
//     const content = (
//       <div key={Math.random()}>
//         <div className='flex gap-10 justify-center'>
//           <button className='btn btn-active btn-accent'>Title</button>
//           <button className='btn'>Company</button>
//           <button className='btn' onClick={handleEvent}>
//             Description
//           </button>
//         </div>
//       </div>
//     );

//     // Use React's render method to append the JSX content to the shadow DOM
//     ReactDOM.render(content, shadow);
//   }, []);

//   const handleEvent = () => {
//     console.log('Button clicked!');
//   };

//   return <div ref={shadowRef}></div>;
// };
let initialtarget = null
let jobMode = null
export default function Buttons({ documentText,disable }) {

  const [exportDataState, setExportDataState] = useAtom(exportData)
  const [postingUrl, setPostingUrl] = useAtom(postingUrlSet)
   //const buttonDescriptions = useMemo(() => useAtomValue(jobDescription), [jobDescription])

   if(documentText.textContent == 'Apply Mode' && jobMode != 'Apply Mode'){
    jobMode = 'Apply Mode'
    }
    else if(documentText.textContent == 'Rejection Mode' && jobMode != 'Rejection Mode'){
      jobMode = 'Rejection Mode'
    }
  console.log(documentText.textContent)
  console.log(exportDataState)
console.log(jobMode)
  // function deleteButtons(){
  //   let removeButtons = document.querySelectorAll('.button-container');
  //   removeButtons.forEach(function(button) {
  //       button.remove();
  //     });
  // }
  async function handleAI(){
    console.log('processing')
    let aiButtons = document.querySelectorAll('input , select, textarea')
    let results = []
    let questionList= []
    let megaQuestionList = []
    aiButtons.forEach(field => {
      console.log(field)
      // we also need to push the label to the data so we can reference it later  
      const label = document.querySelector(`label[for="${field.id}"]`) || field.closest('label') || field.parentElement;
        label.focus()
        const questionText = label ? label.textContent.trim() : "No label found";
        results.push({ field: field.outerHTML, question: questionText });
        try{
          if(field.options.length > 0){
            console.log('running')
            let options = []
            let megaOptions = []
            for (let i = 0; i < field.options.length; i++) {
              megaOptions.push({textValue: field.options[i].text, value: field.options[i].value})
              options.push(field.options[i].text)

            }
            questionList.push({question: questionText, options: options})
            megaQuestionList.push({question: questionText, options: megaOptions, label: field})
          }
        }
        catch{
          if (questionText.length > 0) {
            questionList.push({question: questionText})
            megaQuestionList.push({question: questionText, label: field})
          }
        }
     
        
               autofillField(field, questionText);

    });
    let extentionIdentifier = await AppConfig().idStatus()
    let AI_Response = await fetch(AppConfig().get_AI_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', // Set the content type if you're sending JSON data
          'Authorization': extentionIdentifier, // Add any other headers as needed
          // Add any other headers as needed
      },
      body: JSON.stringify(questionList) // Convert the data to a JSON string
  })
    // let AI_Response = await fetch('http://localhost:3000/Work-Search-App/groqAPI')
    // let AI_Response = await AppConfig().get_AI_URL()
    let AI_ResponseJSON = await AI_Response.json()
    console.log('this is the ai response', AI_ResponseJSON)

  console.log(questionList)
 console.error('megaQuestionList', megaQuestionList)


let manipulationResults = []
AI_ResponseJSON.data.information.forEach(item => {
  let question = item.question
  
let findItem = megaQuestionList.find(x => x.question.replace(/\*/g, '') == question.replace(/\*/g, ''))
  if(findItem){
    console.error('we found a goodone')
    if(findItem.options){
      let option = findItem.options.find(x => x.textValue == item.response)
      if(option){
        manipulationResults.push({question: question, answer: option.value})
        console.error(findItem.label.value)
        findItem.label.click()
        findItem.label.focus()
        findItem.label.value = option.value
      }
    }
    else{
      manipulationResults.push({question: question, answer: item.response})
      findItem.label.click()
      findItem.label.focus()
      simulateTyping(item.response, findItem.label)
      function simulateTyping(text, fieldItem) {
        const input = fieldItem;
        input.focus(); // Focus on the input before typing

        // Iterate through each character in the text
        for (let i = 0; i < text.length; i++) {
            // Create a new event for each character, mimicking a keypress
            const event = new KeyboardEvent('keydown', {
                key: text[i],
                keyCode: text[i].charCodeAt(0), // Deprecated but still used in some browsers
                which: text[i].charCodeAt(0), // Deprecated but still used in some browsers
                altKey: false,
                ctrlKey: false,
                shiftKey: false,
                metaKey: false
            });

            // Dispatch the event on the input element
            input.dispatchEvent(event);

            // Update the value of the input field
            input.value += text[i];

            // Create and dispatch an 'input' event since changing input value via script does not trigger it
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);
        }
    }
    //  findItem.label.value = item.response
    }
  }
  console.log(question)
})
console.log(manipulationResults)
  function autofillField(field, questionText) {
    // Here you can define rules or data to fill the fields based on the question or field type
    if (field.type === 'text') {
        if (questionText.toLowerCase().includes('name')) {
            // field.value = 'John Doe'; // Example name
        } else if (questionText.toLowerCase().includes('email')) {
            // field.value = 'john.doe@example.com'; // Example email
        }
    } else if (field.tagName.toLowerCase() === 'select') {
        // Assume we always select the second option for demonstration
        if (field.options.length > 1) {
            // field.value = field.options[1].value;
            // console.log(field.options[1].value)
        }
    }
}


    // let originNode = AppConfig().getClickedEvent()
    // console.log(originNode.target.textContent)
    console.log('## AI button clicked')
    console.log('##', documentText.textContent)
    console.log(documentText.tagName)
  }

  function handleData(e) {
    let highlightedTexted = window.getSelection().toString().trim()
    let KeyName = e.target.textContent
    console.log(e.target.textContent)
    console.log(documentText)
    if (postingUrl == false) {
      setExportDataState((prevData) => ({
        ...prevData,
        data: { ...prevData.data, Job_Posting_URL: window.location.href },
      }))
      setPostingUrl(true)
    }
    if (highlightedTexted) {
      setExportDataState((prevData) => ({
        ...prevData,
        data: { ...prevData.data, [KeyName]: highlightedTexted },
      }))
    }
    else {
      setExportDataState((prevData) => ({
        ...prevData,
        data: { ...prevData.data, [KeyName]: documentText.textContent },
      }))
    }
  }

  const randomNumber = Math.random();

  function removeButtons() {
    let buttonContainer = document.querySelectorAll('.button-container');
    buttonContainer.forEach(function (button) {
        button.remove();
    });
}
console.log('triggered')

// useEffect(() => {
//   console.log('the button descriptions were changed')
// }, [buttonDescriptions])

  return (
    <div key={randomNumber}>
      <div className='flex flex-wrap gap-5 justify-center bg-green-200 p-2'>
      <button className=' btn btn-sm bg-red-300' onClick={() => handleAI()}>AI</button>
        <button className=' btn btn-sm btn-active btn-accent' onClick={(e) => handleData(e)}>Job_Title</button>
        <button className='btn btn-sm ' onClick={(e) => handleData(e)}>Company</button>
        <button className='btn btn-sm ' onClick={(e) => handleData(e)}>Rejection_Message</button>
        <button className='btn btn-sm ' onClick={(e) => handleData(e)}>Job_Description</button>
        {/* <button className='btn btn-sm ' onClick={deleteButtons}>Remove Buttons</button> */}
        <button className='btn btn-sm ' onClick={()=> removeButtons()}>Collapse</button>
        {/* <button className='btn btn-sm ' onClick={()=> disable()}>Disable App</button> */}
      </div>
    </div>
  )
}

