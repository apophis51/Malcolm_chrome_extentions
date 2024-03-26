
import ApplicationTracker from "./ApplicationTracker";
import { useEffect } from 'react';
import interact from 'interactjs'
import AppConfig from '../AppConfig'


const position = { x: 0, y: 0 }

//This Function is for dragging the nav bar up and down on the y axis
interact('.drager').draggable({
    listeners: {
        start(event) {
            console.log(event.type, event.target)
        },
        move(event) {
            position.y += event.dy
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
                // child.style.border = '1px solid black';

                child.addEventListener('mouseenter', function() {
                    child.style.boxShadow = '0 0 10px rgba(0, 0, 700, 0.6)'; // Apply box shadow on hover
                });
                child.addEventListener('mouseleave', function() {
                    child.style.boxShadow = 'none'; // Remove box shadow when not hovering
                });
            });
            
        }
        if (setUnset == 'unset') {
            children.forEach(function (child) {
                child.style.border = '';
                
                // child.removeEventListener('mouseenter', function() {
                //     child.style.boxShadow = '0 0 10px rgba(0, 0, 700, 0.6)'; // Apply box shadow on hover
                // });
                child.addEventListener('mouseenter', function() {
                    child.style.boxShadow = 'none'; // Apply box shadow on hover
                });
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

    // function activateHandler() {
    //     let activationURL = new url(`http://localhost:3000/WorkSearchApp/Authorize/api`)
    //     const params = new URLSearchParams();
    //     params.append('id', 'value1');
    //     activationURL.search = params.toString();
    //     console.log('activateHandler')
    //     // let tempurl = AppConfig().Url
    //     // let tempurl = 'http://localhost:3000/WorkSearchApp/api'
    //     let tempurl = `http://localhost:3000/WorkSearchApp/Authorize/api?id=fsfdf`
    //     // window.location.href = AppConfig().Url;
    //     fetch(activationURL, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'SDFDFGHSSDFDF',
    //         },
    //     })
    //         .then(response => {
    //             if (response.ok) {
    //                 // Handle successful response
    //                 window.location.href = AppConfig().Url; // Redirect the user
    //             } else {
    //                 // Handle error response
    //                 window.location.href = AppConfig().Url; // Redirect the user

    //             }
    //         })
    //         .catch(error => {
    //             // Handle errors
    //         });
    // }

    async function handleURL() {
        let myID = await AppConfig().idStatus()
        window.location.href = AppConfig().Url(myID)
    }
    useEffect(() => {
        console.log('nav useffect triggered')
        // linkActivator('set')
        // disabler()
        // async function disabler(){
        //     if (AppConfig().disableStatus() == 'true'){
        //         colorDom('set')
        //     }
        //     else {
        //         colorDom('unset')
        //     }
        // }
        
    }, [])

    return (
        <>
            <div className="navbar bg-green-500 fixed z-[2000] gap-10 dontTrack drager">
                <h2>Work Search App</h2>
                {/* <button className='btn' onClick={() => colorDom('set')}>Color DOM</button> */}
                {/* <button className='btn' onClick={() => colorDom('unset')}>UNColor DOM</button> */}
                {/* <button className='btn' onClick={() => linkActivator('set')}>Deactivate Links</button> */}
                {/* <button className='btn' onClick={() => linkActivator('unset')}>Reactivate Links</button> */}
                {/* <button className='btn' onClick={() => removeButtons()}>Remove All Injected Buttons</button> */}
                <button className='btn' onClick={() => disable()}>Disable</button>
                <button className='btn' onClick={() => enable()}>Enable</button>
                <button className='btn' onClick={handleURL}>Activate</button>


            </div>
            <div className='pt-20'>
            </div>
        </>
    )
}