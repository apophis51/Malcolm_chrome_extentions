import { useState, useEffect, useRef } from 'react';
import interact from 'interactjs'
import AppConfig from '../AppConfig'
import Select from 'react-select'
import { atom, useAtom, useSetAtom } from 'jotai'
import { exportData, loggedIn } from './Atoms.js'
import React from "react";
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

let prevJobs = null
export default function ApplicationTracker() {
    const [exportDataState, setExportDataState] = useAtom<ExportData>(exportData)
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [LoggedIn, setLoggedIn] = useAtom(loggedIn)
    const [jobModeColor, setJobModeColor] = useState('bg-blue-200')
    const [rejectionModeColor, setRejectionModeColor] = useState('bg-white')
    const [retrievedJobs, setRetrievedJobs] = useState(null)
    // const [webSocketData, setWebSocketData] = useState(null);
    const socketData = useRef<WebSocketMessage | null>(null)
    console.log('triggered')


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

    type getOrPost = 'POST' | 'GET'

    /**
     * 
     * This function is used to send data to our jobWebAPP or used to get data back
     */
    async function JobListingHandler({ postType }) {
        let getOrPost: getOrPost = postType
        let url = AppConfig()!.jobApiURL
        let bodyType: any = null
        if (postType == 'POST') {
            getOrPost = 'POST'
            bodyType = JSON.stringify(exportDataState)
        }
        if (postType == 'getRjections') {
            getOrPost = 'GET'
            url = AppConfig()!.get_Job_Rejections
            bodyType = null
        }
        if (LoggedIn === false) {
            return null
        }
        console.log(url, getOrPost)
        try {
            console.log(exportDataState)
            let extentionIdentifier = await AppConfig()!.idStatus()
            console.log("sending with auth id", extentionIdentifier)
            let results = await fetch(url, {
                method: getOrPost,
                headers: {
                    'Content-Type': 'application/json', // Set the content type if you're sending JSON data
                    'Authorization': extentionIdentifier, // Add any other headers as needed
                    // Add any other headers as needed
                },
                body: bodyType
            })
            console.log(results)
            prevJobs = await results.json(); // Note the additional 'await' here
            // setRetrievedJobs(prevJobs)
            console.log(prevJobs)
            console.log(exportDataState)
            console.log(await prevJobs.data)
            const regex = /[a-zA-Z ]+/g;
            let tempData = []
            prevJobs.data.information.data.map((item) => {
                const matches = (item.attributes.Company).match(/[a-zA-Z ]+/g)
                if (matches) {
                    console.log(matches.join('').trim())
                    tempData.push({ value: (matches.join('').trim()), label: (matches.join('').trim()) })
                }
                console.log(item.attributes.Company)
            })
            console.log('hit')
            console.log(tempData)
            setRetrievedJobs(tempData)

            if (getOrPost == 'POST') {
                updateWebSocketData()
            }
            function updateWebSocketData() {
                //the socket && part in the condition is a defensive check to make sure that socket is not null or undefined. Without this check, if socket is null (for example, during the initial render before the WebSocket connection is established), attempting to access socket.readyState would result in an error, causing your application to crash.
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
            console.log('we have an error', error)
        }
    }

    async function applicationMode() {
        let target = event!.target as HTMLElement
        let modeSelected = target.textContent

        if (modeSelected == 'Job Mode') {
            setJobModeColor('bg-blue-200')
            setRejectionModeColor('bg-white')
        }
        else if (modeSelected == 'Rejection Mode') {
            setRejectionModeColor('bg-blue-200')
            setJobModeColor('bg-white')
            JobListingHandler({ postType: 'getRjections' })
        }

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
                    <p className={`btn btn-sm hover:bg-blue-200 ${jobModeColor}`} onClick={applicationMode}>Job Mode</p><p className={`btn btn-sm ${rejectionModeColor} hover:bg-blue-200`} onClick={applicationMode}>Rejection Mode</p>
                </div>
                <div className='text-black pt-4 bg-slate-600'>
                    {rejectionModeColor == 'bg-white' && <Select options={retrievedJobs} placeholder={'Select a company'} onChange={(result) => {console.log('cool', result)}}/>}
                    </div>
                <div className='flex justify-center bg-slate-600'>
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
                </div>
                <div className="flex justify-center items-center bg-slate-600">
                    <button className='btn btn-sm bg-red-200 m-5' onClick={() => JobListingHandler({ postType: 'POST' })}>
                        Update Applied Jobs
                    </button>
                </div>
                {!LoggedIn && <p className='bg-red-600'>You Must Click the Activate Menu on the Nav to Submit</p>}
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

