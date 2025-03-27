import React from 'react'
import Navbar from '../components/Navbar'
import Search from '../components/Search'
import Mood from '../components/Mood'
import TrendingMovies from '../components/trendingMovies'


const Home = () => {
  return (
    <div className='h-full w-full bg-black  py-12'>

      <Navbar />

      <TrendingMovies />
    </div>

  )
}

export default Home
