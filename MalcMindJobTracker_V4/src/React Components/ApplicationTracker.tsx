import { useState, useEffect, useRef } from 'react';
import interact from 'interactjs'
import AppConfig from '../AppConfig'
import Select from 'react-select'
import { atom, useAtom, useSetAtom } from 'jotai'
import { exportData, loggedIn, createADate } from './Atoms.js'
import React from "react";
console.log = function () { } 

const position = { x: 0, y: 0 }

interact('.draggable').draggable({
    listeners: {
        start(event) {
            console.log(event.type, event.target)
        },
        move(event) {
            position.x += event.dx
            position.y += event.dy

            event.target.style.transform =
                `translate(${position.x}px, ${position.y}px)`
        },
    }
})

interface WebSocketMessage {
    type: string;
    data: any;
}

interface ExportData {
    data: { [key: string]: any }; // Adjust the value type as per your specific needs
}
type messageObject = { status: statusMessage, tailwindClassColor: tailwindClassColor, loadingIcon: string}
type statusMessage = 'Submitting Job' | 'Submitting Job Rejection' | 'Submission Error' | 'Submission Sucessful!' | 'Retrieving AI Answers' | 'AI Retrieval Sucessful' | 'AI Retrieval Error' | 'Retrieving User Job Data' | 'User Job Data Retrieval Success!' | 'User Data Retrieval Error' | 'null'
type tailwindClassColor ='bg-orange-600' | 'bg-red-600' | 'bg-green-700' | 'null'

function formatDisplayedStatusMessage(status: statusMessage){
    let tailwindClassColor: tailwindClassColor
    let loadingIcon = 'null'
    if (status.includes('Error')) {
        tailwindClassColor = 'bg-red-600'
    }
    else if(status.includes('Sucessful')) {
        tailwindClassColor = 'bg-green-700'
    }
    else if(status == 'null'){
        tailwindClassColor = 'null'
    }
    else{
        tailwindClassColor = 'bg-orange-600'
        loadingIcon = 'loading loading-spinner loading-sm'
    }
    console.log('hit promo')
    console.log(status, tailwindClassColor)
    return { status: status, tailwindClassColor: tailwindClassColor, loadingIcon}
}

let prevJobs = null
export default function ApplicationTracker() {
    const [exportDataState, setExportDataState] = useAtom<ExportData>(exportData)
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [LoggedIn, setLoggedIn] = useAtom(loggedIn)
    const [jobModeColor, setJobModeColor] = useState('bg-blue-200')
    const [rejectionModeColor, setRejectionModeColor] = useState('bg-white')
    const [retrievedJobs, setRetrievedJobs] = useState(null)
    const [statusMessage, setStatusMessage] = useState<messageObject>({status: 'null', tailwindClassColor: 'null', loadingIcon: 'null'})
    // const [webSocketData, setWebSocketData] = useState(null);
    const socketData = useRef<WebSocketMessage | null>(null)
    let rejectionModeOn = rejectionModeColor != 'bg-white'


    useEffect(() => {
        const ws = new WebSocket(AppConfig()!.WebSocket);
        setSocket(ws);

        ws.onopen = () => {
            // WebSocket connection is open, send your message here
            ws.send(JSON.stringify({ type: 'id', data: AppConfig()!.idStatus() }));
        };

        // Handle incoming messages
        ws.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            // setWebSocketData(newData);
            socketData.current = newData
            console.log(socketData.current)
        };
        return () => {
            ws.close();
        };
    }, [LoggedIn]);

    type fetchMethod = 'POST' | 'GET' | 'PUT'
    type postType = 'getJobData' | 'submitNewJobRejection' | 'submitNewJobApplication'

    /**
     * 
     * This function is used to send data to our jobWebAPP or used to get data back
     */
    async function JobListingHandler({ postType } : { postType: postType }) {
        let fetchMethod: fetchMethod
        let url = AppConfig()!.jobApiURL
        let bodyType: any = null
        console.log(postType)
        if (postType == 'submitNewJobApplication') {
            fetchMethod = 'POST'
            setStatusMessage(formatDisplayedStatusMessage('Submitting Job'))
            bodyType = JSON.stringify(exportDataState)
        }
        if (postType == 'getJobData') {
            fetchMethod = 'GET'
            url = AppConfig()!.get_Job_Rejections
            setStatusMessage(formatDisplayedStatusMessage('Retrieving User Job Data'))
            bodyType = null
        }
        if (postType == 'submitNewJobRejection') {
            setStatusMessage(formatDisplayedStatusMessage('Submitting Job Rejection'))
            fetchMethod = 'PUT'
            url = AppConfig()!.get_Job_Rejections
            bodyType = JSON.stringify({
                output: {
                    data: {
                        Rejection_Message: exportDataState.data.Rejection_Message
                    }
                },
                UID: exportDataState.data.id
            })
            console.log(bodyType)
        }
        if (LoggedIn === false) {
            return null
        }
        console.log(url, fetchMethod)
        try {
            console.log(exportDataState)
            let extentionIdentifier = await AppConfig()!.idStatus()
            console.log("sending with auth id", extentionIdentifier)
            let results = await fetch(url, {
                method: fetchMethod,
                headers: {
                    'Content-Type': 'application/json', // Set the content type if you're sending JSON data
                    'Authorization': extentionIdentifier, // Add any other headers as needed
                    // Add any other headers as needed
                },
                body: bodyType
            })
            console.log(results)
            prevJobs = await results.json(); // Note the additional 'await' here
            if(fetchMethod == 'GET'){
            setStatusMessage(formatDisplayedStatusMessage('null'))
            }
            if(fetchMethod == 'POST' || fetchMethod == 'PUT'){
                setStatusMessage(formatDisplayedStatusMessage('Submission Sucessful!'))
            }
            // setRetrievedJobs(prevJobs)
            console.log(prevJobs)
            console.log(exportDataState)
            console.log(await prevJobs.data)
            if (fetchMethod == 'GET') {
                let tempData = []
                prevJobs.data.information.data.forEach((item) => {
                    const matches = (item.attributes.Company).match(/[a-zA-Z1-9 ]+/g)
                    if (matches) {
                        console.log(matches.join('').trim())
                        tempData.push({ value: (matches.join('').trim()), label: (matches.join('').trim()) })
                    }
                    console.log(item.attributes.Company)
                })
                console.log(tempData)
                setRetrievedJobs(tempData)
            }
            console.log('hit')
            if (fetchMethod == 'POST' || fetchMethod == 'PUT') {
                updateWebSocketData()
            }
            function updateWebSocketData() {
                //the socket && part in the condition is a defensive check to make sure that socket is not null or undefined. Without this check, if socket is null (for example, during the initial render before the WebSocket connection is established), attempting to access socket.readyState would result in an error, causing your application to crash.
                console.log('triggered')
                if (socket && socket.readyState === WebSocket.OPEN) {
                    console.log('triggered')
                    socket.send(JSON.stringify({ type: 'jobmessage', data: exportDataState }));
                }
                if (prevJobs.information) {
                    // console.alert(data.data.information);
                    window.alert(prevJobs.data.information);
                }
                if (prevJobs.data.error) {
                    console.error(prevJobs.data.error)
                }
            }
        }
        catch (error) {
            setStatusMessage(formatDisplayedStatusMessage('Submission Error'))
            console.log('we have an error', error)
        }
    }

    async function applicationMode() {
        let target = event!.target as HTMLElement
        let modeSelected = target.textContent

        if (modeSelected == 'Apply Mode') {
            setJobModeColor('bg-blue-200')
            setRejectionModeColor('bg-white')
            setExportDataState({ data: { Job_Title: 'Click on a Job Posting Title to Add a Title', Company: 'Click on a Company Name to Add a Company', Job_Description: 'Click on a Job Description to Add a Description', Applied_Date: createADate() } })
        }
        else if (modeSelected == 'Rejection Mode') {
            setRejectionModeColor('bg-blue-200')
            setJobModeColor('bg-white')
            JobListingHandler({ postType: 'getJobData' })
        }

    }

    function updateDisplayedJobs(selectedResult) {
        console.log('cool', selectedResult.value)
        console.log(prevJobs)
        let functionRam = null
        prevJobs.data.information.data.forEach((item) => {
            const matches = (item.attributes.Company).match(/[a-zA-Z1-9 ]+/g)
            if (matches) {
                if (matches.join('').trim() == selectedResult.value) {
                    console.log(item)
                    console.log(exportDataState)

                    console.log(item.attributes.Company)
                    setExportDataState((prevData) => ({
                        ...prevData,
                        data: { ...prevData.data, Job_Title: item.attributes.Job_Title, Rejection_Message: item.attributes.Rejection_Message, Applied_Date: item.attributes.Applied_Date, Company: item.attributes.Company, Job_Description: item.attributes.Job_Description, id: item.id },
                    }))
                    console.log(exportDataState)
                }
            }
        })

    }


    const handleStyle = () => {
        return {
            // top: boxPosition.y,
            // left: boxPosition.x,
            bottom: '10vh',
            right: '10vw',
            // backgroundColor: 'red',
            minHeight: '400px',
            maxHeight: '400px',
            maxWidth: '300px',
            minWidth: '300px',
        };
    };
    console.log(LoggedIn)
    return (

        <div className='ApplicationTracker dontTrack fixed z-[1999] outline'>
            <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
            <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
            <p>
                {/* {boxPosition.x} {boxPosition.y} */}
            </p>
            <div
                className="card draggable resizable dontTrack  bg-slate-700 text-white border-2 border-green-900 "
                style={{
                    position: 'fixed',
                    ...handleStyle(),
                }}>
                <p className="flex justify-center text-xl bg-slate-700 rounded-xl">Application Tracker</p>
                <h1 className='text-xl flex justify-center bg-slate-700 text-white'>Data Display</h1>
                <div className="flex justify-center bg-slate-600 gap-1  pt-4">
                    <p className={`btn btn-sm hover:bg-blue-200 ${jobModeColor}`} onClick={applicationMode}>Apply Mode</p><p className={`btn btn-sm ${rejectionModeColor} hover:bg-blue-200`} onClick={applicationMode}>Rejection Mode</p>
                </div>
                <div className='text-black pt-3 pb-3 bg-slate-600'>
                    {rejectionModeOn && <Select options={retrievedJobs} placeholder={'Select a company'} onChange={(result) => { updateDisplayedJobs(result) }} />}
                </div>
                {/* <div className='flex justify-center bg-slate-600'>
                    {rejectionModeColor != 'bg-white' &&
                        <select className="select select-bordered  max-w-[90%] mt-4 text-black ">
                            <option disabled selected>Select The Rejection Company</option>
                            {retrievedJobs && prevJobs.data.information.data.map((item) => {
                                const matches = (item.attributes.Company).match(/[a-zA-Z ]+/g)
                                if (matches) {
                                    return (<option>{matches.join('').trim()}</option>)
                                }
                            })}
                        </select>}
                </div> */}
                <div className="flex justify-center items-center bg-slate-600">
                    {!rejectionModeOn && <button className='btn btn-sm bg-red-200 mb-5' onClick={() => JobListingHandler({ postType: 'submitNewJobApplication' })}>
                        Update Applied Jobs
                    </button>}
                    {rejectionModeOn && <button className='btn btn-sm bg-red-200 mb-5' onClick={() => JobListingHandler({ postType: 'submitNewJobRejection' })}>
                        Update Job Rejection
                    </button>}
                </div>
                {!LoggedIn && <p className='bg-red-600'>You Must Click the Activate Menu on the Nav to Submit</p>}
                {statusMessage.status != 'null' && <p className={`${statusMessage.tailwindClassColor} flex justify-center`}>{statusMessage.status} &nbsp;<span className={`${statusMessage.loadingIcon}`}></span></p>}
                <ul className='overflow-y-scroll divide-y-2 p-2 bg-green-600'>
                    {Object.entries(exportDataState.data).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
                {/* {exportDataState.data.Job_Title} */}
            </div>
        </div >
    );
}

