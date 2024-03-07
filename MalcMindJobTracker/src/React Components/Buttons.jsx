// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React from 'react'
import '../index.css'

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


export default function Buttons({test}) {
  console.log(test)

  function handleEvent(event) {
    event.preventDefault()
    console.log('Button clicked')
  }

  const randomNumber = Math.random();


  return (
    <div key={randomNumber}>
      <div className='flex gap-10 justify-center'>
       <button className=' btn btn-active btn-accent'>Title</button>
       <button className='btn'>Company</button>
       <button className= 'btn' onClick={handleEvent}>Description</button>
      </div>
    </div>
  )
}

