import React from 'react'
import Profile from '../components/profile'
import Navbar from '../components/Navbar'
import { ImageOff } from 'lucide-react'
import Logo from '../components/logo.jsx'

function ProfilePage() {
  return (
    <div className='bg-black min-h-screen w-full text-white relative'>
      <Logo/>
    <Navbar className="fixed top-0 left-0 w-full z-50" />
    <Profile />
</div>

  )
}

export default ProfilePage
