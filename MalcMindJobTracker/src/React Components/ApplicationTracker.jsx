import { useState, useEffect } from 'react';
import interact from 'interactjs'

import { atom, useAtom } from 'jotai'
import { testAtom, exportData } from './Atoms.js'

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
    const [count, setCount] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });
    const [testState, setTestState] = useAtom(testAtom)
    const [exportDataState, setExportDataState] = useAtom(exportData)

    const [socket, setSocket] = useState(null);
    const [webSocketData, setWebSocketData] = useState(null);

    console.log(webSocketData)

    //he socket && part in the condition is a defensive check to make sure that socket is not null or undefined. Without this check, if socket is null (for example, during the initial render before the WebSocket connection is established), attempting to access socket.readyState would result in an error, causing your application to crash.
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'message', data: 'whatup' }));
    }
    useEffect(() => {
        // const ws = new WebSocket('ws://localhost:3532');
        const ws = new WebSocket('wss://cryptoai-production.up.railway.app');
        setSocket(ws);
        // ws.send(JSON.stringify({ type: 'message', data: 'whatup' }));
        // Handle incoming messages
        ws.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            setWebSocketData(newData);
        };
          return () => {
            ws.close();
          };
    }, []);





    const handleMouseDown = (event) => {
        setIsMoving(true);
    };

    const handleMouseUp = (event) => {
        setIsMoving(false);
    };

    const handleMouseMove = (event) => {
        if (isMoving) {
            setBoxPosition({
                x: event.clientX + window.scrollX,
                y: event.clientY + window.scrollY,
            });
        }
    };

    async function submitJobListing() {
        try {
            const url = "http://localhost:3000/WorkSearchApp/api"
            // let data = {server: "echo me biiatch"}
            let results = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Set the content type if you're sending JSON data
                    // Add any other headers as needed
                },
                body: JSON.stringify(exportDataState) // Convert the data to a JSON string
            })
            const data = await results.json(); // Note the additional 'await' here
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'jobmessage', data: exportDataState }));
            }
            console.log('we got itt', data);
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
            backgroundColor: 'red',
            minHeight: '400px',
            maxHeight: '400px',
            maxWidth: '300px',
            minWidth: '300px',
        };
    };
    return (
        <div className='ApplicationTracker dontTrack fixed z-10'>
            <p>
                {/* {boxPosition.x} {boxPosition.y} */}
            </p>
            <div
                className="card draggable resizable dontTrack"
                style={{
                    position: 'fixed',
                    ...handleStyle(),
                }}
            // onMouseDown={handleMouseDown}
            // onMouseUp={handleMouseUp}
            // onMouseMove={handleMouseMove}
            >
                <p>Application Tracker</p>
                <button className='btn' onClick={submitJobListing}>
                    SubmitJob Listing
                </button>
                <h1>Data Display</h1>
                <ul>
                    {Object.entries(exportDataState.data).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </ul>
                <p>{testState}</p>
                {exportDataState.data.Job_Title}
            </div>
        </div>
    );
}

