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

let initialtarget = null
let jobMode = null


export async function handleAI() {
    console.log('processing')
    let DOM_Input_Locations = document.querySelectorAll('input , select, textarea')

    let extracted_data = []
    let stitched_deduplicated_data_with_triggered_dom_mutations = []



    var manipulate = { value: 'itch' }

    console.error(DOM_Input_Locations)


    DOM_Input_Locations.forEach(field => {
        console.log(field)
        const label = document.querySelector(`label[for="${field.id}"]`) || field.closest('label') || field.parentElement;
        field.focus()


        const questionText = label ? label.textContent.trim() : "No label found";
        try {
            if (field.options.length > 0) {
                console.log('running')
                let options = []
                let megaOptions = []
                for (let i = 0; i < field.options.length; i++) {
                    megaOptions.push({ textValue: field.options[i].text, value: field.options[i].value })
                    options.push(field.options[i].text)

                }

                extracted_data.push({ question: questionText, options: megaOptions, label: field })
            }
        }
        catch {
            if (questionText.length > 0) {
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

    function triggerDomMutations() {
        DOM_Input_Locations.forEach(field => {
            console.log(field)
            const label = document.querySelector(`label[for="${field.id}"]`) || field.closest('label') || field.parentElement;
            const questionText = label ? label.textContent.trim() : "No label found";

            triggered_dom_mutations.push({ question: questionText, label: field })
            console.log(label.textContent.trim())
            field.focus()
            field.dispatchEvent(domUtils.Mouseevent)
        })

    }

    console.error('observed mutations => Triggered_dom_mutations array', triggered_dom_mutations)



    let extentionIdentifier = await AppConfig().idStatus()
    let AI_Response = 'init'
    console.error('original array after tiggered dom mutations:', extracted_data)
    let limitArrayObjectSize = limit_max_object_property_string_size_in_array(extracted_data, 'question', 500)
    console.error('limited array is:', limitArrayObjectSize)
    let de_duplicated_data = de_duplicate_array_of_objects(limitArrayObjectSize, 'question')

    console.error('deduplicated data', de_duplicated_data)

    stitched_deduplicated_data_with_triggered_dom_mutations = [...de_duplicated_data]

    stitched_deduplicated_data_with_triggered_dom_mutations.forEach((element, index) => {
        triggered_dom_mutations.forEach((data, newindex) => {
            if (data.question.includes(element.question)) {
                if (data.options) {
                    stitched_deduplicated_data_with_triggered_dom_mutations[newindex].options = data.options
                    stitched_deduplicated_data_with_triggered_dom_mutations[newindex]['mutatedChanges'] = true
                }

            }
        })
    })


    console.error('stitched_data_with_triggered_dom_mutations', stitched_deduplicated_data_with_triggered_dom_mutations)

    let data_send_to_AI_endpoint = filter_object_property_from_object_array(de_duplicated_data)

    data_send_to_AI_endpoint.forEach((element, index) => {
        console.log('hit', element.question)
        triggered_dom_mutations.forEach((data, newindex) => {
            if (data.question.includes(element.question)) {
                console.log('perfect hit', element.question)
                if (data.options) {
                    data_send_to_AI_endpoint[newindex].options = data.options
                }

            }
        })
    })
    console.log('data sent to ai end point:', data_send_to_AI_endpoint)
    console.error('data sent to ai end point:', data_send_to_AI_endpoint)

    function filter_object_property_from_object_array(array) {
        let object_to_save_context_space = []
        for (let x = 0; x < array.length; x++) {
            if (array[x].options) {
                let optionAccumulator = []
                array[x].options.forEach(option => {
                    optionAccumulator.push(option.textValue)
                })
                object_to_save_context_space.push({ question: array[x].question, options: optionAccumulator })
            }
            else {
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
                'Authorization': extentionIdentifier,
            },
            body: JSON.stringify(data_send_to_AI_endpoint) // Convert the data to a JSON string
        })
    }
    catch (error) {
        console.error('failed to fetch in handleAI', error)
    }

    let AI_ResponseJSON = await AI_Response.json()
    console.error('this is the ai response', AI_ResponseJSON)
    console.log('this is the ai response', AI_ResponseJSON)

    console.log('extracted data', extracted_data)


    let final_dom_manipulation_results = []
    AI_ResponseJSON.data.information.forEach(item => {
        console.log('hit')
        try {
            let question = item.question

            let findItem = stitched_deduplicated_data_with_triggered_dom_mutations.find((x) => x.question.replace(/\*/g, '') == question.replace(/\*/g, ''))
            let findIndex = stitched_deduplicated_data_with_triggered_dom_mutations.findIndex((x) => x.question.replace(/\*/g, '') == question.replace(/\*/g, ''))


            console.log(findItem)
            if (findItem) {
                if (findItem.options && !findItem.mutatedChanges) {
                    /*we need to find matches in the original dom that without case sensitivity*/
                    let option = findItem.options.find(x => x.textValue.toLowerCase() == item.response.toLowerCase())
                    if (option) {
                        let findOptionIndex = stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].options.findIndex(x => x == item.response) /////////new
                        findItem.label.click()
                        findItem.label.focus()
                        findItem.label.value = option.value
                        stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].label.focus() // with out this i get output.js:49 File chooser dialog can only be shown with a user activation.
                        console.error('hit here')
                        stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].label.dispatchEvent(domUtils.Mouseevent)
                        for (let i = 0; i < findOptionIndex; i++) {
                            domUtils.simulateKeydown(stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].label, 'ArrowDown');
                        }
                        domUtils.simulateKeydown(stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].label, 'Enter');

                    }
                }
                else if (findItem.options && findItem.mutatedChanges == true) {
                    console.info('we found a triggered dom mutation')
                    let findOption = stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].options.find(x => x == item.response)
                    let validResponse = (findOption)
                    if (validResponse) {
                        console.error('major index', findIndex)

                        console.error('good one')
                        /*we need to find matches in the original dom that without case sensitivity*/
                        let findOptionIndex = stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].options.findIndex(x => x.toLowerCase() == item.response.toLowerCase())
                        console.error('=====>', findOption)
                        console.error('find little index*****', findOptionIndex)
                        console.error('focused label alleged', stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].label)
                        stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].label.focus() // with out this i get output.js:49 File chooser dialog can only be shown with a user activation.
                        console.error('hit here')
                        stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].label.dispatchEvent(domUtils.Mouseevent)
                        for (let i = 0; i < parseInt(findOptionIndex); i++) { // Example: 3 times to reach the desired option
                            domUtils.simulateKeydown(stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].label, 'ArrowDown');
                        }
                        domUtils.simulateKeydown(stitched_deduplicated_data_with_triggered_dom_mutations[findIndex].label, 'Enter');
                    }

                }
                else {
                    console.log('hit')
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

                }
            }
            console.log(question)
        }
        catch (error) {

            console.error(' there was a problem with our form inputs:', error)
        }
    })


    observer.disconnect();

    console.log('final dom manipulation results', final_dom_manipulation_results)
    console.error(final_dom_manipulation_results)

    console.error(manipulate)


    console.log('## AI button clicked')

}

export default function Buttons({ documentText, disable }) {
    console.log('##', documentText.textContent)
    console.log(documentText.tagName)


    const [exportDataState, setExportDataState] = useAtom(exportData)
    const [postingUrl, setPostingUrl] = useAtom(postingUrlSet)

    if (documentText.textContent == 'Apply Mode' && jobMode != 'Apply Mode') {
        jobMode = 'Apply Mode'
    }
    else if (documentText.textContent == 'Rejection Mode' && jobMode != 'Rejection Mode') {
        jobMode = 'Rejection Mode'
    }
    console.log(documentText.textContent)
    console.log(exportDataState)
    console.log(jobMode)



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



    return (
        <div key={randomNumber}>
            <div className='flex flex-wrap gap-5 justify-center bg-green-200 p-2'>
                <button className=' btn btn-sm bg-red-300' onClick={() => handleAI()}>AI</button>
                <button className=' btn btn-sm btn-active btn-accent' onClick={(e) => handleData(e)}>Job_Title</button>
                <button className='btn btn-sm ' onClick={(e) => handleData(e)}>Company</button>
                <button className='btn btn-sm ' onClick={(e) => handleData(e)}>Rejection_Message</button>
                <button className='btn btn-sm ' onClick={(e) => handleData(e)}>Job_Description</button>
                <button className='btn btn-sm ' onClick={() => removeButtons()}>Collapse</button>
            </div>
        </div>
    )
}

