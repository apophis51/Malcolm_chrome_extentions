import { useState, useEffect, useRef } from 'react';
import interact from 'interactjs'
import AppConfig from '../AppConfig'

import { atom, useAtom } from 'jotai'
import { exportData } from './Atoms.js'

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




export default function ApplicationTracker() {
    const [exportDataState, setExportDataState] = useAtom(exportData)
    const [socket, setSocket] = useState(null);
    // const [webSocketData, setWebSocketData] = useState(null);
    const socketData = useRef(null)

    // console.log(webSocketData)

    //he socket && part in the condition is a defensive check to make sure that socket is not null or undefined. Without this check, if socket is null (for example, during the initial render before the WebSocket connection is established), attempting to access socket.readyState would result in an error, causing your application to crash.
    // if (socket && socket.readyState === WebSocket.OPEN) {
    //     socket.send(JSON.stringify({ type: 'message', data: 'whatup' }));
    // }



    function pingserver() {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'ping', data: 'ping' }));
        }
    }
    useEffect(() => {
        // const ws = new WebSocket('ws://localhost:3532');


        const ws = new WebSocket(AppConfig().WebSocket);
        setSocket(ws);

        ws.onopen = () => {
            // WebSocket connection is open, send your message here
            ws.send(JSON.stringify({ type: 'id', data: AppConfig().idStatus() }));
        };


        // ws.send(JSON.stringify({ type: 'message', data: 'whatup' }));
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
    }, []);


    async function submitJobListing() {
        try {
            const url = AppConfig().jobApiURL
            console.log(exportDataState)
            let extentionIdentifier = await AppConfig().idStatus()
            console.log("sending with auth id", extentionIdentifier)
            // let data = {server: "echo me biiatch"}
            let results = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type if you're sending JSON data
                    'Authorization': extentionIdentifier, // Add any other headers as needed
                    // Add any other headers as needed
                },
                body: JSON.stringify(exportDataState) // Convert the data to a JSON string
            })

            const data = await results.json(); // Note the additional 'await' here
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'jobmessage', data: exportDataState }));
            }
            if (data.information) {
                console.alert(data.data.information);
            }
            if (data.data.error) {
                console.error(data.data.error)
            }

        }
        catch (error) {
            console.log('we have an error', error)
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
    return (
        <div className='ApplicationTracker dontTrack fixed z-[1999] outline'>
            
            <p>
                {/* {boxPosition.x} {boxPosition.y} */}
            </p>
            <div
                className="card draggable resizable dontTrack bg-green-700 text-white border-2 border-green-900 " 
                style={{
                    position: 'fixed',
                    ...handleStyle(),
                }}>
                <p className="flex justify-center text-xl bg-slate-600 rounded-lg">Application Tracker</p>
                <h1 className='text-xl flex justify-center bg-slate-600'>Data Display</h1>
                <button className='btn btn-sm bg-red-200' onClick={submitJobListing}>
                    Submit Job Data
                </button>
                <ul className = 'overflow-y-scroll divide-y-2 p-2'>
                    {Object.entries(exportDataState.data).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
                {/* {exportDataState.data.Job_Title} */}
            </div>
        </div>
    );
}

