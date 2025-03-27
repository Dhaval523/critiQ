import React from 'react'
import Profile from '../components/Profile'
import Navbar from '../components/Navbar'

function ProfilePage() {
  return (
    <div className='bg-black min-h-screen w-full py-16 text-white'>
        <Navbar/>
        <Profile/>
    </div>
  )
}

export default ProfilePage
