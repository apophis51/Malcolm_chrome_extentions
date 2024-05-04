import React from "react";
import ApplicationTracker from "./ApplicationTracker";
import { useEffect, useState } from 'react';
import interact from 'interactjs'
import AppConfig from '../AppConfig'
import { atom, useAtom } from 'jotai'
import { loggedIn } from './Atoms.js'
import DevBar from './DevBar'

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

type Status = 'Not Logged In - Click Activate to Activate' | 'Logged In - Click LogOut to LogOut'

export default function navBar({ disable, enable }) {
    const [LoggedIn, setLoggedIn] = useAtom(loggedIn)
    const [User, setUser] = useState<Status>('Not Logged In - Click Activate to Activate')
    console.log(LoggedIn)

    function colorDom(setUnset) {
        var children = document.querySelectorAll('*');
        if (setUnset == 'set') {
            children.forEach(function (child: any) {
                // child.style.border = '1px solid black';

                child.addEventListener('mouseenter', function () {
                    child.style.boxShadow = '0 0 10px rgba(0, 0, 700, 0.6)'; // Apply box shadow on hover
                });
                child.addEventListener('mouseleave', function () {
                    child.style.boxShadow = 'none'; // Remove box shadow when not hovering
                });
            });

        }
        if (setUnset == 'unset') {
            children.forEach(function (child: any) {
                child.style.border = '';

                // child.removeEventListener('mouseenter', function() {
                //     child.style.boxShadow = '0 0 10px rgba(0, 0, 700, 0.6)'; // Apply box shadow on hover
                // });
                child.addEventListener('mouseenter', function () {
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

    async function handleLogOut() {
        await AppConfig()!.clearStorage()
        setLoggedIn(false)
        //we want to generate a new ID so that the user can activate the app again in the future
        await AppConfig()!.generateID()
    }

    function handleViewJobs() {
        window.open(AppConfig().submittedJobURL, '_blank')
    } 

    async function handleURL() {
        let myID = await AppConfig()!.idStatus()
        console.log('Activate Button 1 | myID status', myID)
        window.location.href = AppConfig()!.Url(myID)
    }
    async function isAuthorized() {
        let result = await AppConfig()!.isAuthorized()
        console.log(result)
        if (result == false || result == undefined) {
            setUser("Not Logged In - Click Activate to Activate")
            setLoggedIn(false)
        }
        else {
            setUser("Logged In - Click LogOut to LogOut")
            setLoggedIn(true)
        }

    }
    useEffect(() => {
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
        isAuthorized()
    }, [LoggedIn])

    return (
        <>
            <div className="flex justify-center items-center navbar bg-green-800 fixed z-[2000] dontTrack drager  text-white text-3xl group max-h-[50%]" >
                <div className='flex flex-col justify-center items-center' >
                {/* <div className='tooltip tooltip-bottom' data-tip="hold to drag bar"> */}
                    {AppConfig().Mode == 'local' && <DevBar />}
                    <div className='flex justify-center flex-wrap gap-10 '>
                        <h2 className='text-white' >Work Search App</h2>
                        {/* <button className='btn' onClick={() => colorDom('set')}>Color DOM</button> */}
                        {/* <button className='btn' onClick={() => colorDom('unset')}>UNColor DOM</button> */}
                        {/* <button className='btn' onClick={() => linkActivator('set')}>Deactivate Links</button> */}
                        {/* <button className='btn' onClick={() => linkActivator('unset')}>Reactivate Links</button> */}
                        {/* <button className='btn' onClick={() => removeButtons()}>Remove All Injected Buttons</button> */}
                        <button className='btn btn-sm' onClick={() => disable()}>Disable</button>
                        <button className='btn btn-sm' onClick={() => enable()}>Enable</button>
                        {!LoggedIn && <button className='btn btn-sm' onClick={handleURL}>Activate</button>}
                        {LoggedIn && <button className='btn btn-sm' onClick={handleLogOut}>LogOut</button>}
                        {/* <p  className="tooltip tooltip-bottom w-full" data-tip="hold to drag bar">.</p> */}
                    </div>
                    <p className='text-sm text-white'>{User}</p>
                    <p className='text-sm text-white '>View Submitted Jobs at <button className='dontTrack' onClick={handleViewJobs}><a>{AppConfig().submittedJobURL}</a></button></p>
                    <p className='text-md hover:text-red-400 hidden group-hover:block group-hover:visible'>click to drag</p>
                </div>
            </div>
            <div className='pt-20'>
            </div>

        </>
    )
}