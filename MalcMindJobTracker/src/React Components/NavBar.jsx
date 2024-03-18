
import ApplicationTracker from "./ApplicationTracker";
import { useEffect } from 'react';
import interact from 'interactjs'
import AppConfig from '../AppConfig'


const position = { x: 0, y: 0 }

interact('.drager').draggable({
    listeners: {
        start(event) {
            console.log(event.type, event.target)
        },
        move(event) {
            position.y += event.dy
            // position.x += event.dx

            event.target.style.transform =
                `translate(${position.x}px, ${position.y}px)`
        },
    }
})

export default function navBar({ disable, enable }) {


    function colorDom(setUnset) {
        var children = document.querySelectorAll('*');
        if (setUnset == 'set') {
            children.forEach(function (child) {
                child.style.border = '2px solid red';
            });
        }
        if (setUnset == 'unset') {
            children.forEach(function (child) {
                child.style.border = '';
            });
        }
    }

    function linkActivator(setUnset) {
        var links = document.querySelectorAll('a');
        if (setUnset == 'set') {
            links.forEach(function (link) {
                link.style.pointerEvents = 'none';
            });
        }
        if (setUnset == 'unset') {
            links.forEach(function (link) {
                link.style.pointerEvents = 'auto';
            });
        }
    }

    function removeButtons() {
        let buttonContainer = document.querySelectorAll('.button-container');
        buttonContainer.forEach(function (button) {
            button.remove();
        });
    }

    function activateHandler() {
        console.log('activateHandler')
        // let tempurl = AppConfig().Url
        // let tempurl = 'http://localhost:3000/WorkSearchApp/api'
        let tempurl = 'http://localhost:3000/WorkSearchApp/Authorize/api'
        // window.location.href = AppConfig().Url;
        fetch(tempurl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'SDFDFGHSSDFDF',
            },
        })
        .then(response => {
            if (response.ok) {
                // Handle successful response
                window.location.href = AppConfig().Url; // Redirect the user
            } else {
                // Handle error response
                window.location.href = AppConfig().Url; // Redirect the user

            }
        })
        .catch(error => {
            // Handle errors
        });
    }

    useEffect(() => {
        // linkActivator('set')
    }, [])

    return (
        <>
            <div className="navbar bg-green-500 fixed z-10 gap-10 dontTrack drager">
                {/* <ApplicationTracker /> */}
                <p>Test Tag {AppConfig.devUrl}</p>
                <button className='btn' onClick={() => colorDom('set')}>Color DOM</button>
                <button className='btn' onClick={() => colorDom('unset')}>UNColor DOM</button>
                <button className='btn' onClick={() => linkActivator('set')}>Deactivate Links</button>
                <button className='btn' onClick={() => linkActivator('unset')}>Reactivate Links</button>
                <button className='btn' onClick={() => removeButtons()}>Remove All Injected Buttons</button>
                <button className='btn' onClick={() => disable()}>Disable</button>
                <button className='btn' onClick={() => enable()}>Enable</button>
                {/* <button className='btn'><a href= 'http://localhost:3000/WorkSearchApp/Authorize' >Activate</a></button> */}
                <button className='btn' onClick={activateHandler}>Activate</button>

            </div>
            <div className='pt-20'>
            </div>
        </>
    )
}