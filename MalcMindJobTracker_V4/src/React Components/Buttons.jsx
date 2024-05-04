// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React from 'react'
import '../index.css'
import { atom, useAtom } from 'jotai'
import {  exportData, postingUrlSet } from './Atoms.js'



import { useRef, useEffect } from 'react';  //new

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

export default function Buttons({ documentText,disable }) {

  const [exportDataState, setExportDataState] = useAtom(exportData)
  const [postingUrl, setPostingUrl] = useAtom(postingUrlSet)
  console.log(documentText.textContent)
  console.log(exportDataState)

  // function deleteButtons(){
  //   let removeButtons = document.querySelectorAll('.button-container');
  //   removeButtons.forEach(function(button) {
  //       button.remove();
  //     });
  // }
  async function handleAI(){
    let aiButtons = document.querySelectorAll('input , select, textarea')
    let results = []
    let questionList= []
    aiButtons.forEach(field => {
      console.log(field)
        const label = document.querySelector(`label[for="${field.id}"]`) || field.closest('label') || field.parentElement;
        label.focus()
        const questionText = label ? label.textContent.trim() : "No label found";
        results.push({ field: field.outerHTML, question: questionText });
        try{
          if(field.options.length > 0){
            console.log('running')
            let options = []
            for (let i = 0; i < field.options.length; i++) {
              options.push(field.options[i].text)
            }
            questionList.push({question: questionText, options: options})
          }
        }
        catch{
          if (questionText.length > 0) questionList.push({question: questionText})
        }
     
        
               autofillField(field, questionText);

    });

  console.log(questionList)


  function autofillField(field, questionText) {
    // Here you can define rules or data to fill the fields based on the question or field type
    if (field.type === 'text') {
        if (questionText.toLowerCase().includes('name')) {
            field.value = 'John Doe'; // Example name
        } else if (questionText.toLowerCase().includes('email')) {
            field.value = 'john.doe@example.com'; // Example email
        }
    } else if (field.tagName.toLowerCase() === 'select') {
        // Assume we always select the second option for demonstration
        if (field.options.length > 1) {
            field.value = field.options[1].value;
        }
    }
}







    console.log('this was triggered')
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


  return (
    <div key={randomNumber}>
      <div className='flex flex-wrap gap-5 justify-center bg-green-200 p-2'>
      <button className=' btn btn-sm bg-red-300' onClick={() => handleAI()}>AI</button>
        <button className=' btn btn-sm btn-active btn-accent' onClick={(e) => handleData(e)}>Job_Title</button>
        <button className='btn btn-sm ' onClick={(e) => handleData(e)}>Company</button>
        <button className='btn btn-sm ' onClick={(e) => handleData(e)}>Job_Description</button>
        {/* <button className='btn btn-sm ' onClick={deleteButtons}>Remove Buttons</button> */}
        <button className='btn btn-sm ' onClick={()=> disable()}>Disable App</button>
      </div>
    </div>
  )
}

