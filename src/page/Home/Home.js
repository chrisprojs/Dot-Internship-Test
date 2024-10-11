import React from 'react'
import "./Home.css"
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='home-container'>
      <div className='home-box'>
        <h1 className='home-header'>Take Your Quiz Now!</h1>
        <Link to={"/login"} className='home-button'>Get Started Now!</Link>
      </div>
    </div>
  )
}

export default Home