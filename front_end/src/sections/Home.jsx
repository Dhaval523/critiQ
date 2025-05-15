import React from 'react'
import Navbar from '../components/Navbar'
import Search from '../components/Search'
import Mood from '../components/Mood'
import TrendingMovies from '../components/TrendingMovies'


const Home = () => {
  return (
    <div className='h-full w-full bg-gray-900  py-12'>

      <Navbar className= "z-50" />

      <TrendingMovies />
    </div>

  )
}

export default Home
