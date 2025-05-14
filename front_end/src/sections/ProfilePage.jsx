import React from 'react'
import Profile from '../components/profile'
import Navbar from '../components/Navbar'

function ProfilePage() {
  return (
    <div className='bg-black min-h-screen w-full text-white relative'>
    <Navbar className="fixed top-0 left-0 w-full z-50" />
    <div className="pb-16 ">
        <Profile  className="-z-30"/>
    </div>
</div>

  )
}

export default ProfilePage
