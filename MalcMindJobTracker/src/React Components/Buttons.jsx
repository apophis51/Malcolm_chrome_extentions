// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React from 'react'
import '../index.css'
import { atom, useAtom } from 'jotai'
import { testAtom, exportData, postingUrlSet } from './Atoms.js'



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


export default function Buttons({ documentText,disable }) {

  const [testState, setTestState] = useAtom(testAtom)
  const [exportDataState, setExportDataState] = useAtom(exportData)
  const [postingUrl, setPostingUrl] = useAtom(postingUrlSet)
  console.log(documentText)
  console.log(exportDataState)

  function deleteButtons(){
    let removeButtons = document.querySelectorAll('.button-container');
    removeButtons.forEach(function(button) {
        button.remove();
      });
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
        data: { ...prevData.data, [KeyName]: documentText },
      }))
    }
  }

  const randomNumber = Math.random();


  return (
    <div key={randomNumber}>
      <div className='flex flex-wrap gap-5 first-letter:justify-center'>
        <button className=' btn btn-active btn-accent' onClick={(e) => handleData(e)}>Job_Title</button>
        <button className='btn' onClick={(e) => handleData(e)}>Company</button>
        <button className='btn' onClick={(e) => handleData(e)}>Job_Description</button>
        <button className='btn' onClick={deleteButtons}>Remove Buttons</button>
        <button className='btn' onClick={()=> disable()}>Disable App</button>
      </div>
    </div>
  )
}

