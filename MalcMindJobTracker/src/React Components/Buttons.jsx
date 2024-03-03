// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React from 'react'
import '../index.css'

export default function Buttons() {

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

