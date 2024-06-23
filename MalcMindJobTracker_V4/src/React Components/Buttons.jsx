//code smell delete env variables before shipping to production


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React from 'react'
import '../index.css'
import { atom, useAtom, useAtomValue } from 'jotai'
import { exportData, postingUrlSet } from './Atoms.js'
import AppConfig from '../AppConfig.jsx'
import * as domUtils from './domUtils'
import de_duplicate_array_of_objects from './utils/array/de_duplicate_array_of_objects'
import limit_max_object_property_string_size_in_array from './utils/array/limit_max_object_property_string_size_in_array'

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




export default function Buttons({ documentText, disable }) {

    const [exportDataState, setExportDataState] = useAtom(exportData)
    const [postingUrl, setPostingUrl] = useAtom(postingUrlSet)
    //const buttonDescriptions = useMemo(() => useAtomValue(jobDescription), [jobDescription])

    if (documentText.textContent == 'Apply Mode' && jobMode != 'Apply Mode') {
        jobMode = 'Apply Mode'
    }
    else if (documentText.textContent == 'Rejection Mode' && jobMode != 'Rejection Mode') {
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
    async function handleAI() {
        console.log('processing')
        let DOM_Input_Locations = document.querySelectorAll('input , select, textarea')
        //results shape is { field: field.outerHTML, question: questionText }
        let results = []

        //extracted list shape is { question: questionText, options?: megaOptions, label: field }
        let extracted_data = []
            //data_Sent_To_AI shape is { question: questionText, options: options }
    let data_Sent_To_AI_StreamlinedSavesSpace = []


        var manipulate = { value: 'bitch' }
        // let observer = new MutationObserver(domUtils.handleMutations);\   
       
        console.error(DOM_Input_Locations)

        
        DOM_Input_Locations.forEach(field => {
            console.log(field)
            // we also need to push the label to the data so we can reference it later  
            const label = document.querySelector(`label[for="${field.id}"]`) || field.closest('label') || field.parentElement;
            field.focus()
            // field.dispatchEvent(domUtils.Mouseevent)
            //   for (let i = 0; i < 1; i++) { // Example: 3 times to reach the desired option
            //     domUtils.simulateKeydown(field, 'ArrowDown');
            // }
            // domUtils.simulateKeydown(field, 'Enter');

            const questionText = label ? label.textContent.trim() : "No label found";
            results.push({ field: field.outerHTML, question: questionText }); //i dont think im using results any more
            try {
                if (field.options.length > 0) {
                    console.log('running')
                    let options = []
                    let megaOptions = []
                    for (let i = 0; i < field.options.length; i++) {
                        megaOptions.push({ textValue: field.options[i].text, value: field.options[i].value })
                        options.push(field.options[i].text)

                    }
                    data_Sent_To_AI_StreamlinedSavesSpace.push({ question: questionText, options: options })

                    extracted_data.push({ question: questionText, options: megaOptions, label: field })
                }
            }
            catch {
                if (questionText.length > 0) {
                    data_Sent_To_AI_StreamlinedSavesSpace.push({ question: questionText })

                    extracted_data.push({ question: questionText, label: field })
                }
            }
        });
        let old_observed_mutations = new Map()
        let triggered_dom_mutations = []
        let observer = new MutationObserver(domUtils.wrapperfunction(triggered_dom_mutations, old_observed_mutations));

        let observerConfig = { childList: true, subtree: true }
        observer.observe(document.body, observerConfig);
        triggerDomMutations()
        await Promise.resolve();

        //its getting outta sync here because there are 24 dispatched events in test but only 21 have dom mutations
        function triggerDomMutations() {
            DOM_Input_Locations.forEach(field => {
                console.log(field)
                // we also need to push the label to the data so we can reference it later  
                const label = document.querySelector(`label[for="${field.id}"]`) || field.closest('label') || field.parentElement;
                const questionText = label ? label.textContent.trim() : "No label found";

                triggered_dom_mutations.push({question: questionText, label: field})
                // old_observed_mutations.set(question,questionText)
                console.log(label.textContent.trim())
                field.focus()
                field.dispatchEvent(domUtils.Mouseevent)
            })

        }

        console.error('old observed mutations',old_observed_mutations)
        console.error('observed mutations',triggered_dom_mutations)



        let extentionIdentifier = await AppConfig().idStatus()
        let AI_Response = 'init'
        console.error('full array is:', extracted_data)
        let limitArrayObjectSize = limit_max_object_property_string_size_in_array(extracted_data, 'question', 500)
        console.error('limited array is:', limitArrayObjectSize)
        let de_duplicated_data = de_duplicate_array_of_objects(limitArrayObjectSize, 'question')

        console.error('deduplicated data', de_duplicated_data)


        let data_send_to_AI_endpoint = filter_object_property_from_object_array(de_duplicated_data)
        // let itterator = 0
        // delete this section to fix 
        data_send_to_AI_endpoint.forEach((element,index) => {
            console.error('hit',element.question)
            triggered_dom_mutations.forEach((data,newindex) => {
            if(data.question.includes(element.question)){
                console.error('perfect hit',element.question)
                // data_send_to_AI_endpoint[newindex].options = triggered_dom_mutations[triggered_dom_mutations.indexOf(element.options)].options 
                if(data.options){
                data_send_to_AI_endpoint[newindex].options = data.options
                }

            }
        })
            // if(triggered_dom_mutations[itterator].options){
            //     console.log('hit')
            //     element.options = triggered_dom_mutations[itterator].options
            // }
            // itterator++
        })
        //end delete section
        console.log('data sent to ai end point:', data_send_to_AI_endpoint)
        console.error('data sent to ai end point:', data_send_to_AI_endpoint)

        console.error('old save space:', data_Sent_To_AI_StreamlinedSavesSpace)
        function filter_object_property_from_object_array(array) {
            let object_to_save_context_space = []
            for (let x = 0; x < array.length; x++) {
                // object_to_save_context_space.push({ question: array[x].question, options: array[x].options })
                //setting options to undefined is causing error so we dont pushed undefined properties
                if(array[x].options){
                    let optionAccumulator = []
                    array[x].options.forEach(option => {
                        optionAccumulator.push(option.textValue)
                    })
                    object_to_save_context_space.push({ question: array[x].question, options: optionAccumulator })
                }
                else{
                    object_to_save_context_space.push({ question: array[x].question })
                }
            }
            return object_to_save_context_space
        }

        try {
            AI_Response = await fetch(AppConfig().get_AI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type if you're sending JSON data
                    'Authorization': extentionIdentifier, // Add any other headers as needed
                    // Add any other headers as needed
                },
                body: JSON.stringify(data_send_to_AI_endpoint) // Convert the data to a JSON string

                // body: JSON.stringify(data_Sent_To_AI_StreamlinedSavesSpace) // Convert the data to a JSON string
            })
        }
        catch (error) {
            console.error('failed to fetch in handleAI', error)
        }




        // let AI_Response = await fetch('http://localhost:3000/Work-Search-App/groqAPI')
        // let AI_Response = await AppConfig().get_AI_URL()
        let AI_ResponseJSON = await AI_Response.json()
        console.error('this is the ai response', AI_ResponseJSON)
        console.log('this is the ai response', AI_ResponseJSON)

        console.log('extracted data', extracted_data)


        let final_dom_manipulation_results = []
        AI_ResponseJSON.data.information.forEach(item => {
            try {
                let question = item.question

                let findItem = de_duplicated_data.find(x => x.question.replace(/\*/g, '') == question.replace(/\*/g, ''))
                if (findItem) {
                    console.log('we found a goodone')
                    if (findItem.options) {
                        let option = findItem.options.find(x => x.textValue == item.response)
                        if (option) {
                            final_dom_manipulation_results.push({ question: question, answer: option.value })
                            console.log(findItem.label.value)
                            findItem.label.click()
                            findItem.label.focus()
                            findItem.label.value = option.value
                        }
                    }
                    else {
                        final_dom_manipulation_results.push({ question: question, answer: item.response })

                        findItem.label.focus()
                        findItem.label.click()
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
            }
            catch {

                console.error(' there was a problem with our form inputs')
            } //debug this morning
        })

        console.error('haha')
        // await Promise.resolve();

        observer.disconnect();

        console.log(final_dom_manipulation_results)
        console.error(final_dom_manipulation_results)

        console.error(manipulate)



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
                <button className='btn btn-sm ' onClick={() => removeButtons()}>Collapse</button>
                {/* <button className='btn btn-sm ' onClick={()=> disable()}>Disable App</button> */}
            </div>
        </div>
    )
}

