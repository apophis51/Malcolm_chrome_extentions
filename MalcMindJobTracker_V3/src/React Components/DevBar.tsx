import React from "react";
import AppConfig from '../AppConfig'
import { useState } from 'react';

type deploying = 'deploying' | 'deployed' | 'not deploying' | 'failed'

export default function DevBar() {
    const [deployed, setDeployed] = useState('not deploying')

    async function handleClick() {
        setDeployed('deploying')
        try {
            let results = await fetch('http://localhost:3000/Work-Search-App/DeployRoute')


            console.log(results)
            let data = await results.json()
            console.log(data)
            let scriptDeployed = (data.deploymentStatus).includes('built in')
            if (scriptDeployed) {
                setDeployed('deployed')
            }
        }
        catch {
            setDeployed('failed')
        }
        // else if(!scriptDeployed){
        //     setDeployed('failed')
        // }
    }

    return (
        <div className='flex justify-center items-center flex-col gap-5 bg-orange-600 m-5 w-screen'>
            <div className='flex gap-5'>
                <h2 className="text-white">Developer Menu</h2>
                <button className="btn btn-sm bg-red-500" onClick={handleClick}>Deploy App</button>
            </div>
            <p className="text-sm">You are in {AppConfig()!.Mode} Mode</p>
            {deployed == 'deploying' && <p>🌀 Deploying App...</p>}
            {deployed == 'deployed' && <p>🎇 App Deployed! </p>}
            {deployed == 'failed' && <p>☠️ App Failed to Deploy </p>}
        </div>
    )
}