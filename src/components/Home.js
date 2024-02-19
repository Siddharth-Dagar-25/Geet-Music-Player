import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <>
            <div className='pt-10 pl-10'>Click the link below</div>
            <div className='pt-10 pl-10'><Link to="/track" className='text-3xl font-bold underline'>Track</Link></div>
        </>
    )
}

export default Home