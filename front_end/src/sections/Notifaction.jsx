import React from 'react';
import Navbar from '../components/Navbar';
import Notifications from '../components/Notifactions.jsx';
import LogoNavbar from "../components/LogoNavbar.jsx";

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
