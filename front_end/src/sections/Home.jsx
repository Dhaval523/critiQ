import React from 'react'
import Navbar from '../components/Navbar'
import Search from '../components/Search'
import Mood from '../components/Mood'
import TrendingMovies from '../components/TrendingMovies'
import LogoNavbar from '../components/LogoNavbar.jsx'


const Home = () => {
  return (
    <div className='h-full w-full bg-gray-900  py-12'>
       <LogoNavbar/>
      <Navbar className= "z-50" />

      <TrendingMovies />
    </div>

  )
}

export default Home
