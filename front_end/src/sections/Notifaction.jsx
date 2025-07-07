import React from 'react';
import Navbar from '../components/Navbar';
import Notifications from '../components/Notifactions.jsx';
import Logo from "../components/logo.jsx";

const Noti = () => {
  return (
    <div className='bg-black min-h-screen w-full  text-white'>
      <Logo/>
      <Navbar />
      <Notifications /> 
    </div>
  );
};

export default Noti;
