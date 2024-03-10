
import ApplicationTracker from "./ApplicationTracker";
import {useEffect} from 'react';


export default function navBar() {


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

    function linkActivator(setUnset){
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

    function removeButtons(){
        let buttonContainer = document.querySelectorAll('.button-container');
        buttonContainer.forEach(function(button) {
            button.remove();
          });
    }

    useEffect(() => {
        linkActivator('set')
    }, [] )

    return (
        <>
            <div className="navbar bg-green fixed z-10 gap-10 dontTrack">
                <ApplicationTracker />
                <button className='btn' onClick={() => colorDom('set')}>Color DOM</button>
                <button className='btn' onClick={() => colorDom('unset')}>UNColor DOM</button>
                <button className='btn' onClick={() => linkActivator('set')}>Deactivate Links</button>
                <button className='btn' onClick={() => linkActivator('unset')}>Reactivate Links</button>
                <button className='btn' onClick={() => removeButtons()}>Remove All Injected Buttons</button>
            </div>
            <div className='pt-20'>
            </div>
        </>
    )
}