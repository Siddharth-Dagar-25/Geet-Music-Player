import React from 'react'
import { Link } from 'react-router-dom'
import TotalSongsScript from './TotalSongsScript.js'

const Home = () => {
    return (
        <div className='flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gray-800 text-white'>
            <div className='pt-10 pl-10 text-xl text-center lg:text-center'>Gear up for a plunge into uncharted territory, where wonders await or realities shift.</div>
            <div className='pt-10 pl-10'><Link to="/track" className='text-2xl font-bold underline'>Listen Now</Link></div>
            <div className='absolute bottom-8 left-0 p-4'>
                <TotalSongsScript />
            </div>
        </div>
    )
}

export default Home