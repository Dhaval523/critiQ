import React from 'react';
import Navbar from '../components/Navbar';
import Notifications from '../components/Notifactions';
import LogoNavbar from '../components/LogoNavbar';
const Noti = () => {
  return (
    <div className='bg-black min-h-screen w-full  text-white'>
      <LogoNavbar/>
      <Navbar />
      <Notifications /> 
    </div>
  );
};

export default Noti;
